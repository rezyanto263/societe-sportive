'use server';

import { auth } from '@/lib/auth';
import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';

export default async function signInWithGoogle() {
  try {
    const data = await auth.api.signInSocial({
      body: { provider: 'google' },
      headers: await headers(),
    });

    return {
      success: true,
      message: 'Berhasil memulai proses masuk dengan Google.',
      data,
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
