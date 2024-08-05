import { FastifyInstance } from 'fastify';

export const fastifyAuthRules = {
  signInRequired: (fastify: FastifyInstance) => {
    return fastify.auth([fastify.authenticate]);
  },
  signInOrByPass: (fastify: FastifyInstance) => {
    // return fastify.auth([fastify.authenticate, fastify.authPass], { relation: 'or' });
  },
};
