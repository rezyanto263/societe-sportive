import { medias } from '@/database/schema/medias/medias';
import { venues } from '@/database/schema/venues/venues';
import { snakeCase, uuid } from 'drizzle-orm/pg-core';

export const venueMedias = snakeCase.table('venue_medias', {
  venueId: uuid()
    .notNull()
    .references(() => venues.id, { onDelete: 'cascade' }),
  mediaId: uuid()
    .notNull()
    .references(() => medias.id, { onDelete: 'cascade' }),
});
