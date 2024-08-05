import { _errorSchema } from '$tools/schema/atomic';
import { createObjectSchema } from '$tools/schema/createSchemaType';

export const errorResponseSchema = createObjectSchema({
  type: 'object',
  description: 'Error response',
  properties: {
    error: {
      type: 'object',
      required: ['code', 'message'],
      properties: {
        code: _errorSchema.code,
        message: _errorSchema.message,
        errors: _errorSchema.errors,
      },
    },
  },
});
