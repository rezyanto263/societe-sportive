import { getCurrentUser } from '@/core/auth/session';
import OnboardingVerifyForm from '@/modules/auth/components/onboarding-verify-form';
import OnboardingVerifyFormSkeleton from '@/modules/auth/components/onboarding-verify-form/skeleton';
import { Suspense } from 'react';

export default async function OnboardingVerifyPage() {
  const userPromise = getCurrentUser();
  
  return <Suspense fallback={<OnboardingVerifyFormSkeleton />}>
    <OnboardingVerifyForm userPromise={userPromise} />
  </Suspense>
}
