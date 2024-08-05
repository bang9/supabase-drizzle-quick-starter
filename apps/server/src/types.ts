import { FastifyInstance } from 'fastify';

export type FastifyRouteFn = (
  fastify: FastifyInstance,
  opts: Record<string, string>,
  done: (err?: Error | undefined) => void,
) => void;

export type FastifySchema<
  Q extends Record<string, FastifySchemaTypes> = {},
  H extends Record<string, FastifySchemaTypes> = {},
> = {
  summary?: string;
  description?: string;
  tags?: string[];

  headers?: FastifySchemaObjectWithRequired<H>;

  /**
   * @example /route?query=string
   * */
  querystring?: {
    type: 'object';
    required?: string[];
    additionalProperties?: boolean;
    properties: {
      [key: string]:
        | FastifySchemaNull
        | FastifySchemaString
        | FastifySchemaNumber
        | FastifySchemaBoolean
        | FastifySchemaArray
        | FastifySchemaObjectWithRequired<Q>;
    };
  };

  /**
   * @example /route/:params
   * */
  params?: {
    type: 'object';
    properties: Record<string, FastifySchemaString | FastifySchemaNumber>;
  };

  body?: FastifySchemaObject;

  response?: {
    [statusCode: number]: FastifySchemaTypes;
    '2xx'?: FastifySchemaTypes;
    '4xx'?: FastifySchemaTypes;
    '5xx'?: FastifySchemaTypes;
    default?: FastifySchemaTypes;
  };
};

/**
 * @link https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/#validation
 * */
export type FastifySchemaTypes =
  | FastifySchemaNull
  | FastifySchemaString
  | FastifySchemaNumber
  | FastifySchemaBoolean
  | FastifySchemaArray
  | FastifySchemaObject;
interface FastifyBaseSchemaType {
  description?: string;
  default?: string | boolean;
  nullable?: boolean;
}
export interface FastifySchemaNull extends FastifyBaseSchemaType {
  type: 'null';
}
export interface FastifySchemaString extends FastifyBaseSchemaType {
  type: 'string';
  enum?: string[];
}
export interface FastifySchemaNumber extends FastifyBaseSchemaType {
  type: 'number';
}
export interface FastifySchemaBoolean extends FastifyBaseSchemaType {
  type: 'boolean';
}
export interface FastifySchemaArray extends FastifyBaseSchemaType {
  type: 'array';
  items: FastifySchemaTypes;
}
export interface FastifySchemaObject extends FastifyBaseSchemaType {
  type: 'object';
  required?: string[];
  optional?: string[];
  properties: Record<string, FastifySchemaTypes>;
}
export interface FastifySchemaObjectWithRequired<P> extends Omit<FastifySchemaObject, 'required' | 'properties'> {
  required?: P extends Record<infer K, FastifySchemaTypes> ? K[] : never;
  properties: P;
}
