import { statements } from '@/lib/permission';

export type Statement = typeof statements;

export type Permission = {
  [K in keyof typeof statements]?: readonly (typeof statements)[K][number][];
};
