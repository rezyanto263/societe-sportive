import { venues } from '@/database/schema/courts/venues';
import { timestamps } from '@/database/utils';
import { snakeCase, text, uuid } from 'drizzle-orm/pg-core';

export const courts = snakeCase.table('courts', {
  id: uuid().defaultRandom().primaryKey(),
  venueId: uuid()
    .notNull()
    .references(() => venues.id, { onDelete: 'cascade' }),
  name: text().notNull(),
  specifications: text().array(),
  ...timestamps,
});
