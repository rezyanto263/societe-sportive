import { onboardingRoutes } from '@/lib/proxy/routes';
import { matchesRoute, ProxyContext } from '@/lib/proxy/utils';
import { NextResponse } from 'next/server';

export default async function onboardingProxyHandler({
  request,
  user,
}: ProxyContext) {
  const pathname = request.nextUrl.pathname;
  const origin = request.nextUrl.origin;

  const isOnboarding = matchesRoute(pathname, onboardingRoutes);

  // 1. Belum login → tidak boleh masuk onboarding
  if (!user) {
    if (isOnboarding) {
      return NextResponse.redirect(new URL('/sign-in', origin));
    }

    return null;
  }

  // 2. Sudah login, belum punya nomor HP
  if (!user.phoneNumber) {
    if (pathname !== '/onboarding/profile') {
      return NextResponse.redirect(new URL('/onboarding/profile', origin).href);
    }

    return null;
  }

  // 3. Sudah punya HP, tapi belum terverifikasi
  if (!user.phoneNumberVerified) {
    const allowedRoutes = ['/onboarding/verify', '/onboarding/change-phone-number'];
    if (!allowedRoutes.includes(pathname)) {
      return NextResponse.redirect(
        new URL('/onboarding/verify', origin).href,
      );
    }

    return null;
  }

  // 4. Sudah selesai onboarding → tidak boleh kembali ke onboarding
  if (isOnboarding) {
    return NextResponse.redirect(new URL('/', origin));
  }

  return null;
}
