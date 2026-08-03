import { z } from 'zod';
import { streamText, convertToModelMessages, type UIMessage, type ModelMessage } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { env } from '@/lib/env';

const google = createGoogleGenerativeAI({
  apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const requestBodySchema = z.object({
  messages: z.array(z.custom<UIMessage>()),
});

export async function POST(req: Request) {
  try {
    /**
     * Validate environment
     */
    if (!env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return Response.json(
        {
          error: 'Server configuration error: GOOGLE_GENERATIVE_AI_API_KEY is missing',
        },
        {
          status: 500,
        },
      );
    }

    /**
     * Parse JSON body
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

    /**
     * Validate request
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

    /**
     * Convert UI messages into model messages.
     *
     * This preserves compatibility with:
     * - useChat()
     * - reasoning parts
     * - tool calls
     * - future SDK updates
     */
    const modelMessages: ModelMessage[] = await convertToModelMessages(parsed.data.messages)

    /**
     * Generate streamed response
     */
    const result = streamText({
      model: google('gemini-2.5-flash'),
      messages: modelMessages,

      system: `
You are Alpha AI.

You are a helpful, knowledgeable and concise AI assistant.

Always provide accurate, clear and well structured answers.
`.trim(),

      maxRetries: 5,
    });

    /**
     * Return AI SDK UI stream
     */
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat route error:', error);

    return Response.json(
      {
        error: 'Internal server error',
      },
      {
        status: 500,
      },
    );
  }
}
