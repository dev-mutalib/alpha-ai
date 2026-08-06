import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../env';
import * as schema from './schema';

const dbUrl = env.DATABASE_URL;

if (typeof dbUrl !== 'string' || dbUrl.length === 0) {
  throw new Error('DATABASE_URL is missing in environment variables.');
}

const client = postgres(dbUrl);

// Export the db instance with schema attached for relational queries
export const db = drizzle(client, { schema });
