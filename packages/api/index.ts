import createClient from 'openapi-fetch';

import type { paths } from './schema.js';

export const buildAPIClient = (baseUrl: string) => createClient<paths>({ baseUrl });
