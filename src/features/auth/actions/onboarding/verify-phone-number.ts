'use server';

import { auth } from '@/lib/auth';
import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';

export default async function verifyPhoneNumber(data: {
  phoneNumber: string;
  code: string;
}) {
  try {
    const res = await auth.api.verifyPhoneNumber({
      body: {
        phoneNumber: data.phoneNumber,
        code: data.code,
        disableSession: true,
      },
    });

    return {
      success: res.status,
      message: 'Berhasil verifikasi nomor ponsel.',
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
