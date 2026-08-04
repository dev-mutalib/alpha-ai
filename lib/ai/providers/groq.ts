import { createGroq } from '@ai-sdk/groq';
import { env } from '@/lib/env';
import { LanguageModel } from 'ai';

/**
 * Supported GROQ Model ID's in Alpha AI
 */
export const GROQ_MODELS = {
  GPT_OSS_120B: 'openai/gpt-oss-120b',
  LLAMA_3_3_70B: 'llama-3.3-70b-versatile',
  LLAMA_3_1_8B: 'llama-3.1-8b-instant',
  DEEPSEEK_R1_70B: 'deepseek-r1-distill-llama-70b',
} as const;

export type GroqModelId = (typeof GROQ_MODELS)[keyof typeof GROQ_MODELS] | (string & {});

/**
 * Check if GROQ provider is properly configured with API key
 */

export function isGroqConfigured(modelId: GroqModelId): boolean {
  return Boolean(env.GROQ_API_KEY || env.GROQ_API_KEY?.trim() !== '');
}

/**
 * Basic GROQ provider Instance
 */
export const groqProvider = createGroq({
  apiKey: env.GROQ_API_KEY || '',
});

/**
 * Factory function to retrieve a GROQ Language Model Instance
 */
export function getGroqModel(modelId: GroqModelId = GROQ_MODELS.GPT_OSS_120B): LanguageModel {
  if (!isGroqConfigured(modelId)) {
    throw new Error(
      '[Alpha AI]: Your API key is missing, Please configure GROQ_API_KEY in your environment variable',
    );
  }
  return groqProvider(modelId);
}
