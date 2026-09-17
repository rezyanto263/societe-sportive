import { auth } from '@/lib/auth';
import { ProxyContext } from '@/lib/proxy/utils';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export default async function guestProxyHandler({ request }: ProxyContext) {
  const session = await auth.api.getSession({headers: await headers()});

  if (session) return NextResponse.redirect(request.nextUrl.origin);

  return null;
}
