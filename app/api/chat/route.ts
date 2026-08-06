import { z } from 'zod';
import { streamText, convertToModelMessages, type UIMessage, toUIMessageStream } from 'ai';
import { getModel, ProviderType } from '@/lib/ai/index';
import { db } from '@/lib/db/config';
import { chats, messages, memories } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { env } from '@/lib/env';
import { getCurrentUserId } from '@/lib/session';
// Next.js App Router streaming endpoints can be prematurely terminated by serverless defaults.
// Exporting maxDuration ensures long-form response streams finish smoothly.
export const maxDuration = 30;

// Compatible with Postgres.js
export const runtime = 'nodejs';

/**
 * Zod schema for validating incoming chat request payload
 */
const requestBodySchema = z.object({
  messages: z.array(z.custom<UIMessage>()),
  id: z.string().optional(),
  provider: z.string().optional().default('groq'),
  modelId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    /**
     * 1. Parse JSON body securely
     */
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'Invalid JSON request body' }, { status: 400 });
    }

    /**
     * 2. Validate request schema
     */
    const parsed = requestBodySchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { messages: incomingMessages, id: chatId, provider, modelId } = parsed.data;
    const userId = await getCurrentUserId();

    /**
     * 3. Memory Retrieval & Context Injection
     */
    const userMemories = await db.select().from(memories).where(eq(memories.userId, userId));

    const memoryContext =
      userMemories.length > 0
        ? `\n\nUser Context & Preferences to remember:\n${userMemories
            .map((m) => `- ${m.content}`)
            .join('\n')}`
        : '';

    const systemPrompt = `You are Alpha AI.\nYou are a helpful, knowledgeable and concise AI assistant.\nAlways provide accurate, clear and well-structured answers.${memoryContext}`; //

    /**
     * 4. Ensure Chat Session Exists in Turso DB
     */
    if (chatId) {
      const existingChat = await db.select().from(chats).where(eq(chats.id, chatId)).limit(1);

      if (existingChat.length === 0) {
        const lastMsg = incomingMessages[incomingMessages.length - 1];
        let titleString = 'New Chat';
        if (lastMsg) {
          if (typeof (lastMsg as any).content === 'string') {
            titleString = (lastMsg as any).content;
          } else if (lastMsg.parts) {
            const textPart = lastMsg.parts.find(p => p.type === 'text');
            if (textPart && textPart.type === 'text') titleString = textPart.text;
          }
        }
        const title = titleString.slice(0, 30) + (titleString.length > 30 ? '...' : '');

        await db.insert(chats).values({
          id: chatId,
          userId,
          title,
        }); //
      }
    }

    /**
     * 5. Persist Incoming User Message
     */
    const lastUserMessage = incomingMessages[incomingMessages.length - 1];
    if (lastUserMessage && lastUserMessage.role === 'user' && chatId) {
      let contentText = '';
      if (typeof (lastUserMessage as any).content === 'string') {
        contentText = (lastUserMessage as any).content;
      } else if (lastUserMessage.parts) {
        const textPart = lastUserMessage.parts.find(p => p.type === 'text');
        contentText = textPart?.type === 'text' ? textPart.text : JSON.stringify(lastUserMessage.parts);
      }

      try {
        await db.insert(messages).values({
          chatId,
          role: 'user',
          content: contentText || 'No text content',
        });
      } catch (dbError) {
        console.error('Failed to save user message:', dbError);
      }
    }

    /**
     * 6. Convert UI messages into model-facing messages
     * Converts UIMessage[] (parts, reasoning, attachments) to ModelMessage[]
     */
    const modelMessages = await convertToModelMessages(incomingMessages);

    /**
     * 7. Model Selection & Stream Execution
     */
    const selectedModel = getModel(provider as ProviderType, modelId);

    const result = streamText({
      model: selectedModel,
      system: systemPrompt,
      messages: modelMessages,
      maxRetries: 5, //
      abortSignal: req.signal, // Handle browser disconnects to save API costs

      // Save AI Response to Database when streaming finishes
      async onFinish({ text }) {
        if (chatId && text) {
          try {
            await db.insert(messages).values({
              chatId,
              role: 'assistant',
              content: text,
            });
          } catch (dbError) {
            console.error('Failed to save AI response message:', dbError); //
          }
        }
      },
    });

    /**
     * 8. Return AI SDK Stream Response
     */
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('API Error in /api/chat:', error); //
    return new Response(
      JSON.stringify({ error: 'Failed to generate AI response' }), //
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
