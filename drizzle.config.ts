import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
    authToken: process.env.DATABASE_AUTH_TOKEN as string,
  },
  verbose: true,
  strict: true,
});
