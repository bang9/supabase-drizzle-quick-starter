import { UserProfile } from '$database/orm/tables';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const numberString = z.coerce.number().or(z.string());

export const vUserProfileSelect = createSelectSchema(UserProfile, {
  age: numberString,
});
export const vUserProfileInsert = createInsertSchema(UserProfile, {
  age: numberString,
});
