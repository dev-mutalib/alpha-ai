import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { env } from '../env';
import * as schema from './schema';

const dbUrl = env.DATABASE_URL;
const supportedDbUrlSchemes = ['libsql:', 'wss:', 'ws:', 'https:', 'http:', 'file:'] as const;

if (typeof dbUrl !== 'string' || dbUrl.length === 0) {
  throw new Error('DATABASE_URL is missing in environment variables.');
}

function normalizeDatabaseUrl(url: string) {
  const trimmedUrl = url.trim();

  if (trimmedUrl.startsWith('sqlite:')) {
    return `file:${trimmedUrl.slice('sqlite:'.length)}`;
  }

  const scheme = /^[a-z][a-z0-9+.-]*:/i.exec(trimmedUrl)?.[0].toLowerCase();

  if (
    scheme === undefined ||
    !supportedDbUrlSchemes.includes(scheme as (typeof supportedDbUrlSchemes)[number])
  ) {
    throw new Error(
      `DATABASE_URL uses an unsupported URL scheme. Use one of: ${supportedDbUrlSchemes.join(', ')}`,
    );
  }

  return trimmedUrl;
}

const client = createClient({
  url: normalizeDatabaseUrl(dbUrl),
  authToken: env.DATABASE_AUTH_TOKEN,
});

// Export the db instance with schema attached for relational queries
export const db = drizzle(client, { schema });
