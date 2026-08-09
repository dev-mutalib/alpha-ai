import { z } from 'zod';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';

import { getModel, type ProviderType } from '@/lib/ai/index';

import { createMemory, extractMemories, retrieveMemories } from '@/lib/ai/memory';

import { buildMemoryContext } from '@/lib/ai/context';

import { db } from '@/lib/db/config';
import { chats, messages } from '@/lib/db/schema';

import { eq } from 'drizzle-orm';

import { getCurrentUserId } from '@/lib/session';

export const maxDuration = 30;

export const runtime = 'nodejs';

const requestBodySchema = z.object({
  messages: z.array(z.custom<UIMessage>()),
  id: z.string().optional(),
  provider: z.string().optional().default('groq'),
  modelId: z.string().optional(),
});

function getMessageText(message: UIMessage): string {
  if (typeof (message as any).content === 'string') {
    return (message as any).content;
  }

  if (message.parts) {
    return message.parts
      .filter((part): part is Extract<typeof part, { type: 'text' }> => part.type === 'text')
      .map((part) => part.text)
      .join('');
  }

  return '';
}

export async function POST(req: Request) {
  try {
    /*
     * 1. Parse request
     */
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return Response.json(
        {
          error: 'Invalid JSON request body',
        },
        {
          status: 400,
        },
      );
    }

    /*
     * 2. Validate request
     */
    const parsed = requestBodySchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: 'Invalid request body',
          details: parsed.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    const { messages: incomingMessages, id: chatId, provider, modelId } = parsed.data;

    /*
     * 3. Current user
     */
    const userId = await getCurrentUserId();

    /*
     * 4. Select model
     *
     * We use the same model for the response and
     * memory extraction.
     */
    const selectedModel = getModel(provider as ProviderType, modelId);

    /*
     * 5. Retrieve persistent memory
     */
    const userMemories = await retrieveMemories(userId);

    /*
     * 6. Build memory context
     */
    const memoryContext = buildMemoryContext(userMemories);

    /*
     * 7. System prompt
     */
    const systemPrompt = `
You are Alpha AI.

You are a helpful, knowledgeable and concise AI assistant.

Always provide accurate, clear and well-structured answers.

${memoryContext}
`.trim();

    /*
     * 8. Ensure chat exists
     */
    if (chatId) {
      const existingChat = await db.select().from(chats).where(eq(chats.id, chatId)).limit(1);

      if (existingChat.length === 0) {
        const lastMessage = incomingMessages[incomingMessages.length - 1];

        const titleString = lastMessage ? getMessageText(lastMessage) : 'New Chat';

        const title = titleString.slice(0, 30) + (titleString.length > 30 ? '...' : '');

        await db.insert(chats).values({
          id: chatId,
          userId,
          title: title || 'New Chat',
        });
      }
    }

    /*
     * 9. Get latest user message
     */
    const lastMessage = incomingMessages[incomingMessages.length - 1];

    const latestUserMessage = lastMessage?.role === 'user' ? getMessageText(lastMessage) : '';

    /*
     * 10. Persist user message
     */
    if (latestUserMessage && chatId && lastMessage?.role === 'user') {
      try {
        await db.insert(messages).values({
          chatId,
          role: 'user',
          content: latestUserMessage,
        });
      } catch (error) {
        console.error('[Alpha AI] Failed to save user message:', error);
      }
    }

    /*
     * 11. Convert messages for the model
     */
    const modelMessages = await convertToModelMessages(incomingMessages);

    /*
     * 12. Generate response
     */
    const result = streamText({
      model: selectedModel,

      system: systemPrompt,

      messages: modelMessages,

      maxRetries: 5,

      abortSignal: req.signal,

      /*
       * Save assistant response after generation.
       */
      onFinish: async ({ text }) => {
        if (chatId && text) {
          try {
            await db.insert(messages).values({
              chatId,
              role: 'assistant',
              content: text,
            });
          } catch (error) {
            console.error('[Alpha AI] Failed to save AI response:', error);
          }
        }

        if (latestUserMessage) {
          try {
            const extracted = await extractMemories(selectedModel, latestUserMessage);

            for (const memory of extracted.memories) {
              await createMemory({
                userId,
                content: memory.content,
                category: memory.category,
                source: memory.source,
              });
            }

            if (extracted.memories.length > 0) {
              console.log(`[Alpha AI] Saved ${extracted.memories.length} new memories.`);
            }
          } catch (error) {
            console.error('[Alpha AI] Failed to save memories:', error);
          }
        }
      },
    });

    /*
     * 13. Return stream
     */
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('[Alpha AI] API Error:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to generate AI response',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
