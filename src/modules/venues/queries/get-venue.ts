import { cacheTags } from '@/core/cache/tags';
import db from '@/core/database';
import { Venues } from '@/core/database/types';
import { cacheTag } from 'next/cache';
import { cacheLife } from 'next/cache';

export async function getVenue(id: string): Promise<Venues | undefined> {
  'use cache';

  cacheLife('days');
  cacheTag(cacheTags.venues.detail(id));

  return db.query.venues.findFirst({
    where: { id },
    with: {
      thumbnail: true,
      sport: true,
      courts: {
        with: { thumbnail: true },
        where: { deletedAt: { isNull: true } },
      },
      medias: {
        where: { deletedAt: { isNull: true }, status: { eq: 'attached' } },
      },
    },
  });
}
