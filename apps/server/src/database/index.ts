import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '@starter/lib';

import * as enums from './orm/enums';
import * as tables from './orm/tables';

export * from './orm/enums';
export * from './orm/tables';

const dbClient = postgres(env.database_url, { prepare: false });
export const database = drizzle(dbClient, {
  schema: { ...tables, ...enums },
  logger: !!env.value.match(/local|dev/),
});
