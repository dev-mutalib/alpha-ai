import { db } from '@/lib/db/config';
import { memories } from '@/lib/db/schema';

import type { CreateMemoryInput } from '@/lib/ai/memory/types';

export async function createMemory({ userId, content, category, source }: CreateMemoryInput) {
  const [memory] = await db
    .insert(memories)
    .values({
      userId,
      content,
      category,
      source,
    })
    .returning();

  return memory;
}
