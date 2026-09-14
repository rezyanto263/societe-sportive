import { User } from '@/features/auth/types';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export type ProxyContext = {
  request: NextRequest;
  response: NextResponse;
  user?: User | null;
};

export type ProxyHandler = (ctx: ProxyContext) => Promise<NextResponse | null>;

export async function runProxyChain(
  request: NextRequest,
  handlers: ProxyHandler[],
) {
  const data = await auth.api.getSession({ headers: await headers() });
  const ctx: ProxyContext = {
    request,
    response: NextResponse.next({
      request,
    }),
    user: data?.user,
  };

  for (const handler of handlers) {
    const response = await handler(ctx);

    if (response) {
      return response;
    }
  }

  return ctx.response;
}

export function matchesRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}
