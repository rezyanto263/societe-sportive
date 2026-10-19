'use server';

import db from '@/core/database';
import { SignUpData } from '@/modules/auth/types';
import { auth } from '@/core/auth/server';
import { APIError, isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';

export default async function signUp(data: SignUpData) {
  try {
    const isPhoneNumberExists = await db.query.users.findFirst({
      where: { phoneNumber: data.phoneNumber },
    });

    if (isPhoneNumberExists) {
      throw new APIError('CONFLICT', {
        message: 'Nomor ponsel sudah digunakan.',
      });
    }

    await auth.api.createUser({
      body: {
        email: `${data.phoneNumber}@phone.local`,
        name: data.name,
        password: data.password,
        data: {
          phoneNumber: data.phoneNumber,
          gender: data.gender,
        },
      },
    });

    await auth.api.signInPhoneNumber({
      body: {
        phoneNumber: data.phoneNumber,
        password: data.password,
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: 'Berhasil kirim kode verifikasi ke nomor ponsel.',
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
