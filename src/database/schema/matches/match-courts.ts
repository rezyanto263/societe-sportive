import { courts } from '@/database/schema/venues/courts';
import { matches } from '@/database/schema/matches/matches';
import { snakeCase, uuid } from 'drizzle-orm/pg-core';

export const matchCourts = snakeCase.table('match_courts', {
  matchId: uuid()
    .notNull()
    .references(() => matches.id, { onDelete: 'cascade' }),
  courtId: uuid()
    .notNull()
    .references(() => courts.id, { onDelete: 'cascade' }),
});
