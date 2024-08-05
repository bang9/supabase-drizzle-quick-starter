import { DrizzleError } from 'drizzle-orm';
import { FastifyError } from 'fastify';
import { ZodError } from 'zod';

export class ServerError extends Error implements FastifyError {
  code: string;
  message: string;
  statusCode: number;
  errors: unknown[];

  static create(code: string, msg: string, statusCode?: number, errors?: unknown[]) {
    return new ServerError(code, msg, statusCode, errors);
  }

  static normalize(error: ZodError | Error | FastifyError | DrizzleError) {
    if (error instanceof DrizzleError) {
      return ServerError.create(ErrorCode.ERR_DATABASE, error.message, 500);
    }

    if (error instanceof ZodError) {
      return ServerError.create(ErrorCode.INVALID_FIELDS, 'Please check the data', 400, error.errors);
    }

    // @ts-expect-error
    return ServerError.create(error.code ?? ErrorCode.UNKNOWN, error.message, error.statusCode ?? 500);
  }

  constructor(code?: string, msg?: string, statusCode?: number, errors?: unknown[]) {
    super(msg);

    this.code = code ?? ErrorCode.UNKNOWN;
    this.message = msg ?? '';
    this.statusCode = statusCode ?? 500;
    this.errors = errors ?? [];
  }
}

export const ErrorCode = {
  NOT_FOUND_DATA: 'NOT_FOUND_DATA',
  INVALID_FIELDS: 'INVALID_FIELDS',
  ERR_DATABASE: 'ERR_DATABASE',
  UNKNOWN: 'UNKNOWN',
} as const;
