export const SPORTS = {
  BADMINTON: 'badminton',
  BASKETBALL: 'basketball',
} as const;

export type Sport = (typeof SPORTS)[keyof typeof SPORTS];