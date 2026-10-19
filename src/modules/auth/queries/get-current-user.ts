'use server';

import { auth } from '@/core/auth/server';
import { headers } from 'next/headers';

export async function getCurrentUser(refetch: boolean = false) {
  const data = await auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: refetch },
  });

  return data?.user ?? null;
}
