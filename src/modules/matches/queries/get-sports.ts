import db from '@/core/database';
import { sports } from '@/core/database/schema';

export async function getSports() {
  return db.select().from(sports);
}
