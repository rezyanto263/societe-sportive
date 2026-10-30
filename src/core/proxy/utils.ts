import { User } from '@/modules/auth/types';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/core/auth/session';

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
  const user = await getCurrentUser();
  const ctx: ProxyContext = {
    request,
    response: NextResponse.next({ request }),
    user,
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
