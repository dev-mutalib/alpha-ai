import { env } from '@/lib/env';
import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';

/**
 * Supported OpenAI Model IDs in Alpha AI
 */
export const OPENAI_MODELS = {
  GPT_4O: 'gpt-4o',
  GPT_4O_MINI: 'gpt-4o-mini',
  O1: 'o1',
  O1_MINI: 'o1-mini',
  O3_MINI: 'o3-mini',
} as const;

export type OpenAIModelId = (typeof OPENAI_MODELS)[keyof typeof OPENAI_MODELS] | (string & {});

/**
 * Check if the OpenAI Provider is properly configure with API key
 */
export function isOpenAIConfigured(): boolean {
  return Boolean(env.OPENAI_API_KEY && env.OPENAI_API_KEY.trim() !== '');
}

/**
 * Base OpenAI Provider
 */
export const openAIProvider = createOpenAI({
  apiKey: env.OPENAI_API_KEY || '',
  ...(env.NVIDIA_BASE_URL ? { baseURL: env.NVIDIA_BASE_URL } : {}),
});

/**
 * Factory function to retrieve a strongly-typed OpenAI Language Model instance.
 *
 * @param modelId Target OpenAI model ID (default's to `gpt-4o-mini)
 */
export function getOpenAIModel(modelId: OpenAIModelId = OPENAI_MODELS.GPT_4O_MINI): LanguageModel {
  if (!isOpenAIConfigured()) {
    throw new Error(
      '[Alpha AI]: OpenAI API key is missing. Please configure OPENAI_API_KEY in your environment varriable',
    );
  }
  return openAIProvider(modelId);
}

/**
 * Pre-configured model instances for direct use in route handlers
 */
export const openaiModels = {
  gpt4o: openAIProvider(OPENAI_MODELS.GPT_4O),
  gpt4oMini: openAIProvider(OPENAI_MODELS.GPT_4O_MINI),
  o3Mini: openAIProvider(OPENAI_MODELS.O3_MINI),
} as const;
