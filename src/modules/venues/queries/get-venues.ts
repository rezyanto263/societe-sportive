import 'server-only';

import { and, count, eq, ilike, isNull, or } from 'drizzle-orm';

import db from '@/core/database';
import { venues, sports } from '@/core/database/schema';
import type { SearchVenueParamsData } from '@/modules/venues/types';
import { cacheLife } from 'next/cache';
import { cacheTag } from 'next/cache';
import { cacheTags } from '@/core/cache/tags';

export async function getVenues({
  keyword,
  sport,
  page = 1,
  limit = 10,
}: SearchVenueParamsData) {
  'use cache';

  cacheLife('days');
  cacheTag(cacheTags.venues.list);

  const normalizedKeyword = keyword?.trim();

  const [data, [{ total }]] = await Promise.all([
    db.query.venues.findMany({
      with: {
        thumbnail: true,
        sport: true,
        courts: {
          with: { thumbnail: true },
          where: { deletedAt: { isNull: true } },
        },
      },
      where: {
        ...(normalizedKeyword && {
          OR: [
            { name: { ilike: `%${normalizedKeyword}%` } },
            { address: { ilike: `%${normalizedKeyword}%` } },
          ],
        }),
        ...(sport && { sport: { name: { eq: sport } } }),
        deletedAt: { isNull: true },
      },
      orderBy: { name: 'asc', id: 'asc' },
      offset: (page - 1) * limit,
      limit,
    }),

    db
      .select({ total: count() })
      .from(venues)
      .leftJoin(sports, eq(venues.sportId, sports.id))
      .where(
        and(
          isNull(venues.deletedAt),
          normalizedKeyword
            ? or(
                ilike(venues.name, `%${normalizedKeyword}%`),
                ilike(venues.address, `%${normalizedKeyword}%`),
              )
            : undefined,
          sport ? eq(sports.name, sport) : undefined,
        ),
      ),
  ]);

  return {
    data,
    metadata: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
}
