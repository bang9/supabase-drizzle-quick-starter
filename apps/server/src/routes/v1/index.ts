import { meGetHandler, meGetSchema } from '$routes/v1/me/get';
import { mePutHandler, mePutSchema } from '$routes/v1/me/put';
import { fastifyAuthRules } from '$tools/fastifyAuthRules';
import { FastifyRouteFn } from '$types';

export const v1: FastifyRouteFn = (fastify, opts, done) => {
  fastify.get(
    '/me',
    {
      schema: meGetSchema,
      onRequest: fastifyAuthRules.signInRequired(fastify),
    },
    meGetHandler,
  );

  fastify.put<{}>(
    '/me',
    {
      schema: mePutSchema,
      onRequest: fastifyAuthRules.signInRequired(fastify),
    },
    mePutHandler,
  );

  done();
};
