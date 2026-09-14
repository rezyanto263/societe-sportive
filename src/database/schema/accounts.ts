import { users } from '@/database/schema/users';
import { timestamps } from '@/database/utils';
import { index, snakeCase, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const accounts = snakeCase.table(
  'accounts',
  {
    id: uuid().defaultRandom().primaryKey(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp(),
    refreshTokenExpiresAt: timestamp(),
    scope: text(),
    password: text(),
    ...timestamps,
  },
  (table) => [index('account_userId_idx').on(table.userId)],
);
