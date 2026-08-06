'use server';

import { db } from '@/lib/db/config';
import { chats, messages } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrentUserId } from '@/lib/session';

export async function getUserChats() {
  const userId = await getCurrentUserId();
  return await db
    .select()
    .from(chats)
    .where(eq(chats.userId, userId))
    .orderBy(desc(chats.updatedAt));
}

export async function getChatMessages(chatId: string) {
  const userId = await getCurrentUserId();
  
  // Verify ownership
  const chat = await db.select().from(chats).where(eq(chats.id, chatId)).limit(1);
  if (chat.length === 0 || chat[0].userId !== userId) {
    throw new Error('Unauthorized or Chat Not Found');
  }

  return await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(messages.createdAt);
}
