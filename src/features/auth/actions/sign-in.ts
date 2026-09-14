'use server';

import { SignInData } from '@/features/auth/types';
import { auth } from '@/lib/auth';
import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';

export default async function signIn(data: SignInData) {
  try {
    await auth.api.signInPhoneNumber({
      body: {
        phoneNumber: data.phoneNumber,
        password: data.password,
      },
      headers: await headers()
    });

    return {
      success: true,
      message: 'Berhasil masuk akun.',
    };
  } catch (error) {
    console.error(error);

    if (isAPIError(error)) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: 'Terjadi kesalahan.',
    };
  }
}
