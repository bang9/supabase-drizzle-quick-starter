import dotenv from 'dotenv';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const root = resolve(__dirname, '../../../');

const environment = (process.env.NODE_ENV ?? 'local') as 'local' | 'dev' | 'prod';
const envFileName = '.env' + (environment === 'local' ? '' : `.${environment}`);

dotenv.config({ path: join(root, envFileName), override: true });

export const env = {
  value: environment,
  supabase_url: process.env.SUPABASE_URL as string,
  supabase_key: process.env.SUPABASE_KEY as string,
  database_url: process.env.DATABASE_URL as string,
  jwt_secret: process.env.SUPABASE_JWT_SECRET as string,
};
