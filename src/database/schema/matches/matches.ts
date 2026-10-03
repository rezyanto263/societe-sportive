import { sports } from '@/database/schema/matches/sports';
import { venues } from '@/database/schema/venues/venues';
import { softDelete, timestamps } from '@/database/utils';
import {
  date,
  numeric,
  snakeCase,
  text,
  time,
  uuid,
} from 'drizzle-orm/pg-core';

export const matches = snakeCase.table('matches', {
  id: uuid().defaultRandom().primaryKey(),
  sportId: uuid()
    .notNull()
    .references(() => sports.id, { onDelete: 'cascade' }),
  name: text().notNull(),
  date: date().notNull(),
  startTime: time().notNull(),
  endTime: time().notNull(),
  fee: numeric({ precision: 12, scale: 2 }).notNull(),
  venueId: uuid()
    .notNull()
    .references(() => venues.id),
  ...softDelete,
  ...timestamps,
});
