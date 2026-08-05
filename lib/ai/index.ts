import { getGroqModel, GROQ_MODELS } from './providers/groq';
import { getOpenAIModel, OPENAI_MODELS } from './providers/openai';
import { getAnthropicModel, ANTHROPIC_MODELS } from './providers/anthropic';
import { getGoogleModel, GOOGLE_MODELS } from './providers/google';

export type ProviderType = 'groq' | 'openai' | 'anthropic' | 'google';

/**
 * Dynamic registry resolver for AI providers
 */
export function getModel(provider: ProviderType, modelId?: string) {
  switch (provider) {
    case 'groq':
      return getGroqModel(modelId || GROQ_MODELS.GPT_OSS_120B);
    case 'openai':
      return getOpenAIModel(modelId || OPENAI_MODELS.GPT_4O);
    case 'anthropic':
      return getAnthropicModel(modelId || ANTHROPIC_MODELS.CLAUDE_3_5_SONNET);
    case 'google':
      return getGoogleModel(modelId || GOOGLE_MODELS.GEMINI_1_5_FLASH);
    default:
      // Fallback default provider is GROQ
      return getGroqModel(GROQ_MODELS.GPT_OSS_120B);
  }
}
