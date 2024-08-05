import { app, options } from '$app';
import Fastify from 'fastify';

import { env, logger } from '@starter/lib';

const fastify = Fastify({
  logger: {
    transport: {
      target: '@fastify/one-line-logger',
      level: { local: 'debug', dev: 'debug', prod: 'info' }[env.value],
    },
  },
});

logger.level = env.value === 'prod' ? 2 : 4;
app(fastify, options).then(() => {
  fastify
    .listen({ port: 3000 })
    .then(() => {
      fastify.swagger();
    })
    .catch((err) => {
      fastify.log.error(err);
      process.exit(1);
    });
});
