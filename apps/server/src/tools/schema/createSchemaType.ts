import {
  FastifySchemaArray,
  FastifySchemaBoolean,
  FastifySchemaNumber,
  FastifySchemaObject,
  FastifySchemaObjectWithRequired,
  FastifySchemaString,
} from '$types';
import { diff } from 'radash';

export const createStringSchema = (params: Partial<FastifySchemaString>): FastifySchemaString => ({
  nullable: false,
  ...params,
  type: 'string',
});
export const createNumberSchema = (params: Partial<FastifySchemaNumber>): FastifySchemaNumber => ({
  nullable: false,
  ...params,
  type: 'number',
});
export const createBooleanSchema = (params: Partial<FastifySchemaBoolean>): FastifySchemaBoolean => ({
  nullable: false,
  ...params,
  type: 'boolean',
});
export const createObjectSchema = <T>({
  optional = [],
  ...params
}: Partial<FastifySchemaObjectWithRequired<T>>): FastifySchemaObject => ({
  nullable: false,
  required: diff(Object.keys(params.properties ?? {}), optional) as any,
  properties: {} as any,
  ...params,
  type: 'object',
});
export const createArraySchema = (params: Partial<FastifySchemaArray>): FastifySchemaArray => ({
  nullable: false,
  items: { type: 'string' },
  ...params,
  type: 'array',
});
