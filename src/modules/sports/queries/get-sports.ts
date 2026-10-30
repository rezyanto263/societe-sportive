import { cacheTags } from '@/core/cache/tags';
import db from '@/core/database';
import { sports } from '@/core/database/schema';
import { cacheLife } from 'next/cache';
import { cacheTag } from 'next/cache';

export async function getSports() {
  'use cache';

  cacheLife('max');
  cacheTag(cacheTags.sports.list);

  return db.select().from(sports);
}
