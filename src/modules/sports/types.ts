import { SPORTS } from '@/modules/sports/constants';

export type Sport = (typeof SPORTS)[keyof typeof SPORTS];
