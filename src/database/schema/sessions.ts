import { users } from '@/database/schema/users';
import { timestamps } from '@/database/utils';
import { index, snakeCase, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const sessions = snakeCase.table(
  'sessions',
  {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp().notNull(),
    token: text().notNull().unique(),
    ipAddress: text(),
    userAgent: text(),
    impersonatedBy: text(),
    ...timestamps,
  },
  (table) => [index('session_userId_idx').on(table.userId)],
);
