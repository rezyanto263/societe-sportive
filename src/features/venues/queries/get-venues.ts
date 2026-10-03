import db from '@/database';

export async function getVenues() {
  return db.query.venues.findMany({
    with: { sport: true, courts: { where: { deletedAt: { isNull: true } } } },
    orderBy: { name: 'asc' },
    where: {
      deletedAt: { isNull: true },
    },
  });
}
