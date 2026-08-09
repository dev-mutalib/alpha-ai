import { generateText, Output } from 'ai';
import { z } from 'zod';

import type { LanguageModel } from 'ai';
import type { MemoryExtractionResult } from '@/lib/ai/memory/types';

const memoryExtractionSchema = z.object({
  memories: z.array(
    z.object({
      content: z.string().min(1).max(500),
      category: z.enum(['preference', 'fact', 'instruction', 'profile']),
      source: z.enum(['explicit', 'inferred']),
    }),
  ),
});

const MEMORY_EXTRACTION_PROMPT = `
You are Alpha AI's persistent memory extractor.

Your job is to identify information from the user's latest
message that should be remembered across future conversations.

Only extract information that has long-term usefulness.

Good memories include:

- Programming language preferences
- Framework or tooling preferences
- Long-term projects
- Long-term goals
- User preferences
- Stable working habits
- Explicit instructions about how Alpha AI should interact
- Stable profile information

Examples:

User:
"Remember that I prefer TypeScript."

Memory:
{
  "content": "The user prefers TypeScript.",
  "category": "preference",
  "source": "explicit"
}

User:
"Remember that I'm building Alpha AI."

Memory:
{
  "content": "The user is building Alpha AI.",
  "category": "profile",
  "source": "explicit"
}

User:
"Always give me code using TypeScript."

Memory:
{
  "content": "The user prefers code examples in TypeScript.",
  "category": "instruction",
  "source": "explicit"
}

DO NOT remember:

- One-time questions
- Temporary tasks
- Current conversation state
- Random statements
- General knowledge
- Information about other people
- Passwords
- API keys
- Authentication tokens
- Secrets
- Highly sensitive personal information

Do not invent facts.

If nothing should be remembered, return:

{
  "memories": []
}

Keep each memory concise and factual.
`;

export async function extractMemories(
  model: LanguageModel,
  userMessage: string,
): Promise<MemoryExtractionResult> {
  if (!userMessage.trim()) {
    return {
      memories: [],
    };
  }

  try {
    const result = await generateText({
      model,

      output: Output.object({
        schema: memoryExtractionSchema,
      }),

      system: MEMORY_EXTRACTION_PROMPT,

      prompt: `
Analyze the following user message.

<user_message>
${userMessage}
</user_message>
      `.trim(),

      maxRetries: 2,
    });

    return result.output;
  } catch (error) {
    console.error('[Alpha AI] Memory extraction failed:', error);

    return {
      memories: [],
    };
  }
}
