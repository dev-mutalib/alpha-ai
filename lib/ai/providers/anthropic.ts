import { createAnthropic } from '@ai-sdk/anthropic';
import { env } from '@/lib/env';

export const ANTHROPIC_MODELS = {
  CLAUDE_3_5_SONNET: 'claude-3-5-sonnet-20241022',
  CLAUDE_3_5_HAIKU: 'claude-3-5-haiku-20241022',
} as const;

export type AnthropicModelId =
  (typeof ANTHROPIC_MODELS)[keyof typeof ANTHROPIC_MODELS] | (string & {});

export function isAnthropicConfigured(): boolean {
  return Boolean(env.ANTHROPIC_API_KEY);
}

export const anthropicProvider = createAnthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

export function getAnthropicModel(modelId: AnthropicModelId = ANTHROPIC_MODELS.CLAUDE_3_5_SONNET) {
  if (!isAnthropicConfigured()) {
    throw new Error('ANTHROPIC_API_KEY is missing. Please add it to your environment variables.');
  }
  return anthropicProvider(modelId);
}
