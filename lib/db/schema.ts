import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createAt: timestamp('create_at')
    .notNull()
    .defaultNow(),
});

export const chats = pgTable('chats', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull().default('New Conversation'),
  createdAt: timestamp('created_at')
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow(),
});

export const messages = pgTable('messages', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  chatId: text('chat_id')
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['user', 'assistant', 'system', 'data'] }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .defaultNow(),
  // Add this to track edits/regenerations:
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()), // Drizzle feature to auto-update the timestamp
});

export const memories = pgTable('memories', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),

  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  content: text('content').notNull(),

  category: text('category', {
    enum: ['preference', 'fact', 'instruction', 'profile'],
  })
    .notNull()
    .default('fact'),

  source: text('source', {
    enum: ['explicit', 'inferred'],
  })
    .notNull()
    .default('explicit'),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
