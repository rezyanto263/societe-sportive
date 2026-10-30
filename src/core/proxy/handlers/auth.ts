import { ProxyContext } from '@/core/proxy/utils';
import { NextResponse } from 'next/server';

export default async function authProxyHandler({
  request,
  user,
}: ProxyContext) {
  const url = new URL(
    `/sign-in?callbackUrl=${encodeURIComponent(request.url)}`,
    request.nextUrl.origin,
  ).href;

  if (!user) return NextResponse.redirect(url);

  return null;
}
