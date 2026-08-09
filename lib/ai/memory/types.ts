import type { ExtractedMemory, Memory, MemoryCategory, MemorySource } from '@/types/memory';

export type { ExtractedMemory, Memory, MemoryCategory, MemorySource };

export type MemoryExtractionResult = {
  memories: ExtractedMemory[];
};

export type CreateMemoryInput = {
  userId: string;
  content: string;
  category: MemoryCategory;
  source: MemorySource;
};

export type MemoryContext = {
  memories: Memory[];
  prompt: string;
};
