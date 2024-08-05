import { type UserProfile, userRoleEnum } from '$database';
import { createArraySchema, createObjectSchema, createStringSchema } from '$tools/schema/createSchemaType';

export const _errorSchema = {
  code: createStringSchema({
    description: 'error code',
  }),
  message: createStringSchema({
    description: 'error message',
  }),
  errors: createArraySchema({
    description: 'errors, it could be any type of error like validations',
    items: createObjectSchema({}),
  }),
};

export const _authUsersSchema = {
  id: createStringSchema({
    description: 'id of user',
  }),
};
export const _basicSchema = {
  id: createStringSchema({
    description: 'id of data',
  }),
  createdAt: createStringSchema({
    description: 'Date and time the resource was created',
  }),
  updatedAt: createStringSchema({
    description: 'Date and time the resource was updated',
    nullable: true,
  }),
  deletedAt: createStringSchema({
    description: 'Date and time the resource was deleted',
    nullable: true,
  }),
};

export const _userProfileSchema = {
  ..._basicSchema,
  userId: _authUsersSchema.id,
  avatar: createStringSchema({
    description: 'avatar image url of user',
  }),
  nickname: createStringSchema({
    description: 'nickname of user',
  }),
  email: createStringSchema({
    description: 'email of user',
  }),
  role: createStringSchema({
    description: 'role of user',
    enum: userRoleEnum.enumValues,
  }),
  provider: createStringSchema({
    description: 'auth provider',
  }),
  age: createStringSchema({
    description: 'age of user',
  }),
} satisfies Record<keyof typeof UserProfile.$inferInsert, object>;
