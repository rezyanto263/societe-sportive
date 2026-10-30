import 'server-only';

import db from '@/core/database';
import { courts, sports, venues } from '@/core/database/schema';
import { count, isNull } from 'drizzle-orm';
import { cacheLife } from 'next/cache';
import { cacheTag } from 'next/cache';
import { cacheTags } from '@/core/cache/tags';

export async function getVenueStats() {
  'use cache';

  cacheLife('days');
  cacheTag(cacheTags.venues.stats);

  const [[{ totalVenues }], [{ totalCourts }], [{ totalSports }]] =
    await Promise.all([
      db
        .select({ totalVenues: count() })
        .from(venues)
        .where(isNull(venues.deletedAt)),

      db
        .select({ totalCourts: count() })
        .from(courts)
        .where(isNull(courts.deletedAt)),

      db
        .select({ totalSports: count() })
        .from(sports)
        .where(isNull(sports.deletedAt)),
    ]);

  return {
    totalVenues,
    totalCourts,
    totalSports,
  };
}
