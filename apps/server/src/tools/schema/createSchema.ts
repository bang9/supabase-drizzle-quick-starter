import { FastifySchema, FastifySchemaTypes } from '$types';

export function createSchema<T extends Record<string, FastifySchemaTypes>>(schema: FastifySchema<T>): FastifySchema<T> {
  return schema;
}
