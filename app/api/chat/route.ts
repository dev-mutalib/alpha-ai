import { z } from 'zod';
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { env } from '@/lib/env.js';

const google = createGoogleGenerativeAI({
  apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Define a schema for message parts (e.g., text, images)
const partSchema = z.object({
  type: z.enum(['text', 'image', 'file']), // Extend as needed
  text: z.string().optional(),
  // Add other part types (e.g., `imageUrl: z.string().optional()`) if needed
});

// Schema for individual chat messages
const chatMessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().optional(),
  parts: z.array(partSchema).optional(),
});

// Schema for the request body
const requestBodySchema = z.object({
  messages: z.array(chatMessageSchema),
});

export async function POST(req: Request) {
  try {
    // Validate API key
    if (!env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: 'Server configuration error: Missing GOOGLE_GENERATIVE_AI_API_KEY',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const parsed = requestBodySchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          error: 'Invalid request body',
          details: parsed.error.flatten().fieldErrors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Transform messages to extract content from `parts` or `content`
    const messages = parsed.data.messages.map((message) => {
      let contentStr = message.content || '';
      if (!contentStr && message.parts) {
        contentStr = message.parts
          .filter((p) => p.type === 'text' && p.text)
          .map((p) => p.text)
          .join('');
      }
      return {
        role: message.role,
        content: contentStr,
      };
    });

    // Stream response from Google's Gemini
    const result = streamText({
      model: google('gemini-2.5-flash'),
      messages,
      system: 'You are a helpful, concise assistant.', // Optional system prompt
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat route error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
