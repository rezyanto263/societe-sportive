'use server';

import { auth } from '@/core/auth/server';
import { cacheTags } from '@/core/cache/tags';
import db from '@/core/database';
import { users } from '@/core/database/schema';
import { CreateMemberData } from '@/modules/members/types';
import { APIError } from 'better-auth';
import { isAPIError } from 'better-auth/api';
import { eq } from 'drizzle-orm';
import { updateTag } from 'next/cache';
import { headers } from 'next/headers';

export async function createMember(data: CreateMemberData) {
  try {
    const { success: canCreateMember } = await auth.api.userHasPermission({
      body: { permissions: { user: ['create'] } },
      headers: await headers(),
    });

    if (!canCreateMember) throw new APIError('FORBIDDEN');

    const isPhoneNumberExists = await db.query.users.findFirst({
      where: { phoneNumber: data.phoneNumber },
    });

    if (isPhoneNumberExists) {
      throw new APIError('CONFLICT', {
        message: 'Nomor ponsel sudah digunakan.',
      });
    }

    await db.transaction(async (tx) => {
      await auth.api.createUser({
        body: {
          email: `${data.phoneNumber}@phone.local`,
          name: data.name,
          password: data.password,
          role: data.role,
          data: {
            phoneNumber: data.phoneNumber,
            gender: data.gender,
          },
        },
      });

      await tx
        .update(users)
        .set({ phoneNumber: data.phoneNumber })
        .where(eq(users.email, `${data.phoneNumber}@phone.local`));
    });

    updateTag(cacheTags.members.list);

    return {
      success: true,
      message: 'Berhasil membuat anggota.',
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
