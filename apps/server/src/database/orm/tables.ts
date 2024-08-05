import dayjs from 'dayjs';
import { sql } from 'drizzle-orm';
import { boolean, numeric, pgSchema, pgTable, serial, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { userRoleEnum } from './enums';
import { datetime } from './types';

/**
 * supabase managed schema
 * */
const authSchema = pgSchema('auth');
export const AuthUsers = authSchema.table('users', {
  instanceId: uuid('instance_id'),
  id: uuid('id').notNull().primaryKey(),
  aud: varchar('aud'),
  role: varchar('role'),
  email: varchar('email'),
  lastSignInAt: timestamp('last_sign_in_at', { withTimezone: true }),
  isAnonymous: boolean('is_anonymous').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
});

const defaultColumns = () => ({
  id: serial('id').primaryKey(),
  createdAt: datetime('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: datetime('updated_at').$onUpdate(() => dayjs()),
  deletedAt: datetime('deleted_at'),
});

const userId = (name = 'user_id') => {
  return uuid(name)
    .notNull()
    .references(() => AuthUsers.id, { onDelete: 'cascade' });
};

export const UserProfile = pgTable('user_profile', {
  ...defaultColumns(),
  userId: userId('user_id').unique(),
  avatar: varchar('avatar', { length: 125 }).notNull().default('https://placehold.co/250'),
  nickname: varchar('nickname', { length: 50 }).notNull().default('User'),
  email: varchar('email', { length: 50 }).notNull().default(''),
  role: userRoleEnum('role').notNull().default('user'),
  provider: varchar('provider', { length: 20 }).notNull().default('Unknown'),
  age: numeric('age').$type<number | string>().notNull().default(0),
});
