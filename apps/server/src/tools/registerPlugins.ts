import { ErrorMessage, ServerLocale, localizedMessage } from '$core/error/localize';
import { errorResponseSchema } from '$tools/schema/shared';
import { fastifyAuth } from '@fastify/auth';
import { fastifyCors } from '@fastify/cors';
import { fastifyJwt } from '@fastify/jwt';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import dayjs from 'dayjs';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { env } from '@starter/lib';

/** onRequest vs preHandler - https://github.com/fastify/fastify-auth#security-considerations **/

declare module 'fastify' {
  type Decorator = (req: FastifyRequest, res: FastifyReply, done: (err?: Error) => void) => Promise<void> | void;

  interface FastifyInstance {
    // jwt plugin
    authenticate: Decorator;

    // auth plugin
    // authPass: Decorator;
  }

  interface FastifyRequest {
    utcOffset: number;
    locale: ServerLocale;
    localize: (k: keyof ErrorMessage) => string;
  }
}

declare module '@fastify/jwt' {
  type UserId = string & { _userId: true };
  interface FastifyJWT {
    payload: {
      iss: string; // 'http://127.0.0.1:54321/auth/v1';
      sub: UserId; // '146296a8-f8ee-41ca-b955-7a485bf14fbe';
      aud: string; // 'authenticated';
      exp: number; // 1721149555;
      iat: number; // 1721145955;
      email: string; // 'test@user.com';
      phone: string; // '';
      app_metadata: { provider: string; providers: string[] }; // { provider: 'email'; providers: ['email'] };
      user_metadata: {
        email: string;
        avatar_url?: string;
        picture?: string;
        full_name?: string;
        name?: string;
      };
      role: string; //'authenticated';
      aal: string; //'aal1';
      amr: object[]; // [{ method: 'password'; timestamp: 1721145955 }];
      session_id: string; // uuid
      is_anonymous: boolean; //false;
    };
  }
}

const servers = [
  {
    url: 'https://api-prod.server.com',
    description: 'prod server',
  },
  {
    url: 'https://api-dev.server.com',
    description: 'dev server',
  },
  {
    url: 'http://localhost:3000',
    description: 'local server',
  },
];

servers.sort((a, b) => {
  return a.description.startsWith(env.value) ? -1 : 0;
});

const pluginList = {
  'swagger': function (fastify: FastifyInstance) {
    fastify.register(fastifySwagger, {
      openapi: {
        openapi: '3.0.0',
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
            },
          },
          schemas: {
            ErrorResponse: errorResponseSchema,
            Headers: {
              type: 'object',
              properties: {
                'X-UTC-Offset': {
                  type: 'number',
                  description: 'The UTC offset of the client',
                },
                'Accept-Language': {
                  type: 'string',
                  description: 'The language of the client',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
        info: {
          title: 'Starter API',
          description: 'STARTER API with fastify swagger',
          version: '0.0.1',
        },
        servers,
      },
    });
  },

  'swagger-ui': function (fastify: FastifyInstance) {
    fastify.register(fastifySwaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        persistAuthorization: true,
      },
    });
  },

  'cors': function (fastify: FastifyInstance) {
    fastify.register(fastifyCors, {});
  },

  // https://github.com/fastify/fastify-jwt
  'jwt': function (fastify: FastifyInstance) {
    fastify.register(fastifyJwt, {
      secret: env.jwt_secret,
    });

    fastify.decorate('authenticate', async function (req, res, done) {
      try {
        await req.jwtVerify();
      } catch (err) {
        done(err as Error);
      }
    });
  },

  // https://github.com/fastify/fastify-auth
  'auth': function (fastify: FastifyInstance) {
    fastify.register(fastifyAuth, {
      defaultRelation: 'and',
    });

    // fastify.decorate('authPass', (_, __, done) => {});
  },
};

export function registerPlugins(fastify: FastifyInstance, plugins: (keyof typeof pluginList)[]) {
  plugins.forEach((name) => {
    const register = pluginList[name];
    if (register) register(fastify);
  });

  registerLocale(fastify);
}

const utcOffsetValidator = z.coerce.number().catch(dayjs().utcOffset()).default(dayjs().utcOffset());
function registerLocale(fastify: FastifyInstance) {
  fastify.decorateRequest('locale', 'en');
  fastify.decorateRequest('localize', null);

  fastify.addHook('preHandler', (request, _, done) => {
    request.utcOffset = utcOffsetValidator.parse(request.headers['x-utc-offset']);

    request.locale = (request.headers['accept-language'] ?? 'en') as ServerLocale;
    request.localize = (k: keyof ErrorMessage) => localizedMessage(request.locale, k);

    done();
  });
}
