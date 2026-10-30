'use server';

import { RequestPasswordResetData } from '@/modules/auth/types';
import { auth } from '@/core/auth/server';
import { isAPIError } from 'better-auth/api';

export default async function requestPasswordReset(
  data: RequestPasswordResetData,
) {
  try {
    await auth.api.requestPasswordResetPhoneNumber({
      body: { phoneNumber: data.phoneNumber },
    });

    return {
      success: true,
      message: 'Berhasil mengirimkan kode verifikasi.',
    };
  } catch (error) {
    console.log(error);

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
