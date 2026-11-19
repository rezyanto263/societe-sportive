import { AuthSchema } from '@/modules/auth/schema';
import { auth } from '@/core/auth/server';
import z from 'zod';
import { ROLE } from '@/modules/auth/constants';

export type SignInData = z.infer<typeof AuthSchema.signIn>;
export type SignUpData = z.infer<typeof AuthSchema.signUp>;
export type OnboardingProfileData = z.infer<
  typeof AuthSchema.onboardingProfile
>;
export type OnboardingChangePhoneNumberData = z.infer<
  typeof AuthSchema.onboardingChangePhoneNumber
>;
export type RequestPasswordResetData = z.infer<
  typeof AuthSchema.requestPasswordReset
>;
export type VerifyPasswordResetData = z.infer<
  typeof AuthSchema.verifyPasswordReset
>;

export type User = typeof auth.$Infer.Session.user;

export type Role = (typeof ROLE)[keyof typeof ROLE];
