import 'server-only';
import { db } from '@/lib/db/config';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const DEFAULT_USER = {
  id: 'default_user',
  name: 'Default User',
  email: 'default@example.com',
};

/**
 * Ensures the default user row exists in the database to satisfy FK constraints.
 */
async function ensureDefaultUser() {
  try {
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, DEFAULT_USER.id))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(users).values(DEFAULT_USER).onConflictDoNothing();
    }
  } catch (error) {
    console.error('Failed to auto-create default user in DB:', error);
  }
}

// TODO: Replace with actual auth integration (e.g. better-auth or next-auth)
export async function getSession() {
  await ensureDefaultUser();
  return {
    user: DEFAULT_USER,
  };
}

export async function getCurrentUserId() {
  const session = await getSession();
  return session.user.id;
}

