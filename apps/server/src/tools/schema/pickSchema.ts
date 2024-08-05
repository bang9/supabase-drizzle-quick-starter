import { FastifySchemaTypes } from '$types';

type AtomicSchema = Record<string, FastifySchemaTypes>;

interface Injection {
  nullable?: boolean;
}

export const pickSchema = <T extends AtomicSchema, K extends keyof T, I extends Injection>(
  schema: T,
  keys: K[] | readonly K[],
  injection?: I,
): { [key in K]: T[key] & I } => {
  const result: AtomicSchema = {};

  for (const key of keys) {
    if (schema[key]) {
      result[key as string] = {
        ...schema[key],
        ...injection,
      };
    }
  }

  return result as { [key in K]: T[key] & I };
};
