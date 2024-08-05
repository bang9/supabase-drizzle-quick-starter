import { env } from './src/envs.js';
import { logger } from './src/logger.js';

export * from './src/envs.js';
export * from './src/logger.js';

// logger.level = env.value === 'prod' ? 2 : 4;
logger.info('environment:', env.value);
