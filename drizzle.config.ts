import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './apps/server/src/database/orm/schemas/*',
  out: './supabase/migrations',
  dialect: 'postgresql',
  schemaFilter: ['public'],
  // dbCredentials: {
  //   url: process.env.DATABASE_URL!,
  // },
});
