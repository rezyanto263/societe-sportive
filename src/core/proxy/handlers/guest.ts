import { ProxyContext } from '@/core/proxy/utils';
import { NextResponse } from 'next/server';

export default async function guestProxyHandler({ request, user }: ProxyContext) {
  if (user) return NextResponse.redirect(request.nextUrl.origin);

  return null;
}
