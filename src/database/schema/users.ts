import { timestamps } from '@/database/utils';
import { boolean, snakeCase, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = snakeCase.table('users', {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  email: text().unique(),
  emailVerified: boolean().default(false).notNull(),
  phoneNumber: text().unique(),
  phoneNumberVerified: boolean().default(false).notNull(),
  image: text(),
  role: text(),
	banned: boolean(),
	banReason: text(),
	banExpires: timestamp({ precision: 6, withTimezone: true }),
  ...timestamps,
});
