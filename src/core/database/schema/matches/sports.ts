import { softDelete, timestamps } from '@/core/database/utils';
import { snakeCase, text, uuid } from 'drizzle-orm/pg-core';

export const sports = snakeCase.table('sports', {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  ...softDelete,
  ...timestamps,
});
