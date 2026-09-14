'use server';

import { VerifyPasswordResetData } from '@/features/auth/types';
import { auth } from '@/lib/auth';
import { isAPIError } from 'better-auth/api';

export default async function verifyPasswordReset(
  data: VerifyPasswordResetData,
) {
  try {
    await auth.api.resetPasswordPhoneNumber({
      body: {
        phoneNumber: data.phoneNumber,
        otp: data.otp,
        newPassword: data.password,
      },
    });

    return {
      success: true,
      message: 'Berhasil mengatur ulang kata sandi.',
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
