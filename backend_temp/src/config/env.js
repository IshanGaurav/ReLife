import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  MONGO_URI: z.string().url().default('mongodb://localhost:27017/relife'),
  JWT_SECRET: z.string().min(1).default('secret-key-for-dev'),
  AWS_REGION: z.string().default('us-east-1'),
  S3_BUCKET: z.string().default('relife-bucket'),
  GEMINI_TIMEOUT_MS: z.coerce.number().default(20000),
  HIGH_RATIO_THRESHOLD: z.coerce.number().default(2.0),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
