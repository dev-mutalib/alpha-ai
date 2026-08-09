export type MemoryCategory = 'preference' | 'fact' | 'instruction' | 'profile';

export type MemorySource = 'explicit' | 'inferred';

export type Memory = {
  id: string;
  userId: string;
  content: string;
  category: MemoryCategory;
  source: MemorySource;
  createdAt: Date;
  updatedAt: Date;
};

export type ExtractedMemory = {
  content: string;
  category: MemoryCategory;
  source: MemorySource;
};
