'use server';

import { auth } from '@/lib/auth';
import { isAPIError } from 'better-auth/api';

export default async function resendOtp(phoneNumber: string) {
  try {
    const message = await auth.api.sendPhoneNumberOTP({
      body: { phoneNumber: phoneNumber },
    });

    return {
      success: true,
      message: 'Berhasil kirim kode verifikasi baru.',
      data: { message },
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
