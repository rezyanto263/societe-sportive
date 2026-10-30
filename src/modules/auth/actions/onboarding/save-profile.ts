'use server';

import db from '@/core/database';
import { users } from '@/core/database/schema';
import { getCurrentUser } from '@/core/auth/session';
import { OnboardingProfileData } from '@/modules/auth/types';
import { auth } from '@/core/auth/server';
import { APIError, isAPIError } from 'better-auth/api';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export default async function saveProfile(data: OnboardingProfileData) {
  try {
    const user = await getCurrentUser(true);

    const isPhoneNumberExists = await db.query.users.findFirst({
      where: { phoneNumber: data.phoneNumber },
    });

    if (isPhoneNumberExists) {
      throw new APIError('CONFLICT', {
        message: 'Nomor ponsel sudah digunakan.',
      });
    }

    const statusUser = await auth.api.updateUser({
      body: { name: data.name, gender: data.gender },
      headers: await headers(),
    });

    const statusPassword = await auth.api.setPassword({
      body: { newPassword: data.password },
      headers: await headers(),
    });

    await db
      .update(users)
      .set({ phoneNumber: data.phoneNumber })
      .where(eq(users.id, user!.id));

    if (!statusUser || !statusPassword) throw new Error();

    await auth.api.sendPhoneNumberOTP({
      body: { phoneNumber: data.phoneNumber },
      headers: await headers(),
    });

    return {
      success: true,
      message: 'Berhasil menyimpan profil akun.',
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
