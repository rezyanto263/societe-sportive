import { softDelete, timestamps } from '@/database/utils';
import { pgEnum, snakeCase, text, uuid } from 'drizzle-orm/pg-core';

export const mediaResourceType = pgEnum('media_resource_type',['image', 'video']);
export const mediaStatus = pgEnum('media_status', ['pending', 'attached']);

export const medias = snakeCase.table('medias', {
  id: uuid().defaultRandom().primaryKey(),
  publicId: text().notNull(),
  url: text().notNull(),
  resourceType: mediaResourceType().notNull(),
  status: mediaStatus().default('pending'),
  ...softDelete,
  ...timestamps,
});
