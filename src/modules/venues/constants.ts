import { VenueTab } from '@/modules/venues/types';

export const VENUE_TABS = [
  'information',
  'courts',
  'gallery',
  'match',
] as const;

export const DEFAULT_TAB: VenueTab = 'information';
