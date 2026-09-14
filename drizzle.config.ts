import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema',
  out: './src/database/migrations',
  schemaFilter: ['public', 'drizzle'],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
