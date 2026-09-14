'use server';

import { auth } from '@/lib/auth';
import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';

export default async function signOut() {
  try {
    const { success, ...data } = await auth.api.signOut({
      headers: await headers(),
    });

    return {
      success,
      message: 'Berhasil keluar dari akun.',
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
