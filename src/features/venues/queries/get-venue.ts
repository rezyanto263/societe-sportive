import db from '@/database';

export async function getVenue(id: string) {
  return db.query.venues.findFirst({
    where: { id },
    with: { sport: true, courts: { where: { deletedAt: { isNull: true } } } },
  });
}
