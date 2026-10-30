import { ProxyContext } from '@/core/proxy/utils';
import { NextResponse } from 'next/server';

export default async function organizerProxyHandler({ request, user }: ProxyContext) {
  if (user?.role !== 'organizer') {
    return NextResponse.redirect(request.nextUrl.origin);
  }

  return null;
}
