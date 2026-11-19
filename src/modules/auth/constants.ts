import { gender } from '@/core/database/schema';

export const GENDER = {
  MALE: gender.enumValues[0],
  FEMALE: gender.enumValues[1],
} as const;

export const ROLE = {
  ORGANIZER: 'organizer',
  PLAYER: 'player',
} as const;
