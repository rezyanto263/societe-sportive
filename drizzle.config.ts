import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/core/database/schema',
  out: './src/core/database/migrations',
  schemaFilter: ['public', 'drizzle'],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
