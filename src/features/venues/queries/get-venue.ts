import db from '@/database';
import { Venues } from '@/database/types';

export async function getVenue(id: string): Promise<Venues | undefined> {
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
