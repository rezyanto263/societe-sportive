import { sports } from '@/database/schema/matches/sports';
import { timestamps } from '@/database/utils';
import { snakeCase, text, uuid } from 'drizzle-orm/pg-core';

export const venues = snakeCase.table('venues', {
  id: uuid().defaultRandom().primaryKey(),
  sportId: uuid()
    .notNull()
    .references(() => sports.id, { onDelete: 'cascade' }),
  name: text().notNull(),
  phoneNumber: text().notNull(),
  googleMapsUrl: text().notNull(),
  address: text().notNull(),
  city: text(),
  facilities: text().array(),
  notes: text(),
  ...timestamps,
});
