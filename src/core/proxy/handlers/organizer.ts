import { auth } from '@/core/auth/server';
import { ProxyContext } from '@/core/proxy/utils';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export default async function organizerProxyHandler({ request }: ProxyContext) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user.role !== 'organizer')
    return NextResponse.redirect(request.nextUrl.origin);

  return null;
}
