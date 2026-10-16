import { medias } from '@/database/schema/medias/medias';
import { venues } from '@/database/schema/venues/venues';
import { softDelete, timestamps } from '@/database/utils';
import { snakeCase, text, uuid } from 'drizzle-orm/pg-core';

export const courts = snakeCase.table('courts', {
  id: uuid().defaultRandom().primaryKey(),
  thumbnailId: uuid().references(() => medias.id, { onDelete: 'set null' }),
  venueId: uuid()
    .notNull()
    .references(() => venues.id, { onDelete: 'cascade' }),
  name: text().notNull(),
  specifications: text().array().notNull(),
  ...softDelete,
  ...timestamps,
});
