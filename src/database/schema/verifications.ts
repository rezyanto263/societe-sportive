import { timestamps } from '@/database/utils';
import { index, snakeCase, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const verifications = snakeCase.table(
  'verifications',
  {
    id: uuid().defaultRandom().primaryKey(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp().notNull(),
    ...timestamps,
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
);
