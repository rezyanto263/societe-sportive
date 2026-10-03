import { sports } from '@/database/schema/matches/sports';
import { softDelete, timestamps } from '@/database/utils';
import { numeric, snakeCase, text, uuid } from 'drizzle-orm/pg-core';

export const venues = snakeCase.table('venues', {
  id: uuid().defaultRandom().primaryKey(),
  sportId: uuid()
    .notNull()
    .references(() => sports.id, { onDelete: 'cascade' }),
  name: text().notNull(),
  phoneNumber: text().notNull(),
  googleMapsUrl: text().notNull(),
  address: text().notNull(),
  facilities: text().array(),
  notes: text(),
  fee: numeric({ precision: 12, scale: 2 }).notNull(),
  ...softDelete,
  ...timestamps,
});
