import { auth } from '@/lib/auth';
import { ProxyContext } from '@/lib/proxy/utils';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export default async function authProxyHandler({ request }: ProxyContext) {
  const session = await auth.api.getSession({headers: await headers()});
  const url = new URL(`/sign-in?callbackUrl=${encodeURIComponent(request.url)}`, request.nextUrl.origin).href;
  
  if (!session) return NextResponse.redirect(url);

  return null;
}
