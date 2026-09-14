import relations from '@/database/relations';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof postgres> | undefined;
};

const client =
  globalForDb.client ??
  postgres(process.env.DATABASE_URL!, {
    prepare: false,
    max: 5,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.client = client;
}

const db = drizzle({
  client,
  relations,
  
});

export default db;