import { ServerError } from '$core/error';
import { v1 } from '$routes/v1';
import { registerPlugins } from '$tools/registerPlugins';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
import { FastifyPluginAsync } from 'fastify';

dayjs.extend(utc);
dayjs.extend(timezone);

// Place your custom options for app below here.
export type AppOptions = {};

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
  logger: {
    level: 'info',
  },
};

const app: FastifyPluginAsync<AppOptions> = async (fastify, options): Promise<void> => {
  registerPlugins(fastify, ['swagger', 'swagger-ui', 'cors', 'jwt', 'auth']);

  fastify.after(() => {
    fastify.setErrorHandler((err, _, reply) => {
      const error = ServerError.normalize(err);

      fastify.log.error(error);
      reply.status(error.statusCode).send({ error });
    });

    fastify.get('/health', (req, res) => {
      res.status(200).send('ok');
    });

    fastify.register(v1, { prefix: '/v1' });
  });
};

export { app, options };
export default app;
