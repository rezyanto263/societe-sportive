import { auth } from '@/core/auth/server';
import { toNextJsHandler } from 'better-auth/next-js';
export const { POST, GET } = toNextJsHandler(auth);
