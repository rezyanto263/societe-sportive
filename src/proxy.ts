import authProxyHandler from '@/core/proxy/handlers/auth';
import guestProxyHandler from '@/core/proxy/handlers/guest';
import onboardingProxyHandler from '@/core/proxy/handlers/onboarding';
import organizerProxyHandler from '@/core/proxy/handlers/organizer';
import { authRoutes, guestRoutes } from '@/core/proxy/routes';
import { matchesRoute, ProxyHandler, runProxyChain } from '@/core/proxy/utils';
import { NextRequest } from 'next/server';

export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const handlers: ProxyHandler[] = [onboardingProxyHandler];

  if (pathname.startsWith('/dashboard')) handlers.push(organizerProxyHandler);

  if (matchesRoute(pathname, guestRoutes)) handlers.push(guestProxyHandler);

  if (matchesRoute(pathname, authRoutes)) handlers.push(authProxyHandler);

  return runProxyChain(req, handlers);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
