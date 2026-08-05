import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { env } from '@/lib/env';

export const GOOGLE_MODELS = {
  GEMINI_1_5_PRO: 'gemini-1.5-pro-latest',
  GEMINI_1_5_FLASH: 'gemini-1.5-flash-latest',
} as const;

export type GoogleModelId = (typeof GOOGLE_MODELS)[keyof typeof GOOGLE_MODELS] | (string & {});

export function isGoogleConfigured(): boolean {
  return Boolean(env.GOOGLE_GENERATIVE_AI_API_KEY);
}

export const googleProvider = createGoogleGenerativeAI({
  apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export function getGoogleModel(modelId: GoogleModelId = GOOGLE_MODELS.GEMINI_1_5_FLASH) {
  if (!isGoogleConfigured()) {
    throw new Error(
      'GOOGLE_GENERATIVE_AI_API_KEY is missing. Please add it to your environment variables.',
    );
  }
  return googleProvider(modelId);
}
