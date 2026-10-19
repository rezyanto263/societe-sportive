import db from '@/core/database';
import { Venues } from '@/core/database/types';

export async function getVenues(): Promise<Venues[]> {
  return db.query.venues.findMany({
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
    orderBy: { name: 'asc' },
    where: {
      deletedAt: { isNull: true },
    },
  });
}
