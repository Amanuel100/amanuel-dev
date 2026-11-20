import 'dotenv/config';
import { z } from 'zod';
const boolean = z.enum(['true', 'false']).default('false').transform((value) => value === 'true');
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'), PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DB_HOST: z.string().default('127.0.0.1'), DB_PORT: z.coerce.number().int().default(3306), DB_USER: z.string().default('portfolio'), DB_PASSWORD: z.string().default(''), DB_NAME: z.string().regex(/^[a-zA-Z0-9_]+$/).default('amanuel_portfolio'), DB_SSL: boolean,
  SMTP_HOST: z.string().default('localhost'), SMTP_PORT: z.coerce.number().int().default(1025), SMTP_USER: z.string().default(''), SMTP_PASS: z.string().default(''), SMTP_SECURE: boolean,
  MAIL_FROM: z.string().default('Portfolio <portfolio@amanueleyob.dev>'), MAIL_TO: z.string().email().default('amanuel@amanueleyob.dev'),
  CORS_ORIGIN: z.string().default('http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173'), TRUST_PROXY: z.coerce.number().int().min(0).max(5).default(0), DEMO_MODE: boolean
});
export const env = schema.parse(process.env);
if (env.NODE_ENV === 'production' && (env.DEMO_MODE || !env.DB_PASSWORD || !env.SMTP_USER || !env.SMTP_PASS)) throw new Error('Production requires MySQL and SMTP credentials; demo mode is development-only.');
