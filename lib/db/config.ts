import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { env } from '../env';
import * as schema from './schema';

const dbUrl = env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL is missing in environment variables.');
}
// Creates a local 'sqlite.db' file in your project root
const client = createClient({
  url: dbUrl,
  authToken: env.DATABASE_AUTH_TOKEN,
});

// Export the db instance with schema attached for relational queries
export const db = drizzle(client, { schema });
