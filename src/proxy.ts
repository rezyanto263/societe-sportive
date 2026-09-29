import authProxyHandler from '@/lib/proxy/handlers/auth';
import guestProxyHandler from '@/lib/proxy/handlers/guest';
import onboardingProxyHandler from '@/lib/proxy/handlers/onboarding';
import organizerProxyHandler from '@/lib/proxy/handlers/organizer';
import { authRoutes, guestRoutes } from '@/lib/proxy/routes';
import { matchesRoute, ProxyHandler, runProxyChain } from '@/lib/proxy/utils';
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
