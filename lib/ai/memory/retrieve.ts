import { desc, eq } from 'drizzle-orm';

import { db } from '@/lib/db/config';
import { memories } from '@/lib/db/schema';

export async function retrieveMemories(userId: string, limit = 20) {
  return db
    .select()
    .from(memories)
    .where(eq(memories.userId, userId))
    .orderBy(desc(memories.updatedAt))
    .limit(limit);
}
