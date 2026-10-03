import db from '@/database';

export async function getVenues() {
  return db.query.venues.findMany({
    with: { sport: true, courts: true },
    orderBy: { name: 'asc' }
  });
}
