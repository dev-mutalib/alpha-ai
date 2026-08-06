import 'dotenv/config';
import { db } from '../lib/db/config';
import { users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const existingUser = await db.select().from(users).where(eq(users.id, 'default_user')).limit(1);
  if (existingUser.length === 0) {
    await db.insert(users).values({
      id: 'default_user',
      name: 'Default User',
      email: 'default@example.com'
    });
    console.log('Inserted default_user');
  } else {
    console.log('default_user already exists');
  }
}

main().catch(console.error);
