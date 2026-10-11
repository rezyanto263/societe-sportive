export const VENUE_TABS = [
  'information',
  'courts',
  'gallery',
  'match',
] as const;

export type VenueTab = (typeof VENUE_TABS)[number];

export const DEFAULT_TAB: VenueTab = 'information';