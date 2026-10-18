import { courts, medias, sports, venues } from '@/database/schema';
import { Prettify } from 'better-auth';

export type Sports = typeof sports.$inferSelect;
export type Medias = typeof medias.$inferSelect;
export type Courts = Prettify<
  typeof courts.$inferSelect & { thumbnail: Medias | null }
>;
export type Venues = Prettify<
  typeof venues.$inferSelect & {
    thumbnail: Medias;
    sport: Sports;
    courts: Courts[];
    medias: Medias[];
  }
>;
