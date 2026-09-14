'use server';

import db from '@/database';
import { users } from '@/database/schema';
import getUser from '@/features/auth/actions/get-user';
import { OnboardingChangePhoneNumberData } from '@/features/auth/types';
import { auth } from '@/lib/auth';
import { APIError, isAPIError } from 'better-auth/api';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export default async function changePhoneNumber(
  data: OnboardingChangePhoneNumberData,
) {
  try {
    const user = await getUser();

    const isPhoneNumberExists = await db.query.users.findFirst({
      where: { phoneNumber: data.phoneNumber },
    });

    if (isPhoneNumberExists && user!.phoneNumber! !== data.phoneNumber) {
      throw new APIError('CONFLICT', {
        message: 'Nomor ponsel sudah digunakan.',
      });
    }

    await db
      .update(users)
      .set({ phoneNumber: data.phoneNumber })
      .where(eq(users.phoneNumber, user!.phoneNumber!));

    await auth.api.sendPhoneNumberOTP({
      body: { phoneNumber: data.phoneNumber },
      headers: await headers(),
    });

    return {
      success: true,
      message: 'Berhasil kirim kode verifikasi ke nomor ponsel baru.',
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
