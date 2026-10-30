import 'server-only';
import { cache } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/core/auth/server';
import { connection } from 'next/server';

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

export async function getCurrentUser() {
  await connection();

  const data = await getSession();

  return data?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/sign-in');
  return user;
}
