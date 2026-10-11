'use server';

import db from '@/database';
import { courts } from '@/database/schema';
import { CreateCourtData } from '@/features/venues/types';
import { auth } from '@/lib/auth';
import { APIError } from 'better-auth';
import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';

export async function createCourt(data: CreateCourtData) {
  try {
    const { success: canCreateCourt } = await auth.api.userHasPermission({
      body: { permissions: { venues: ['update'] } },
      headers: await headers(),
    });

    if (!canCreateCourt) throw new APIError('FORBIDDEN');

    await db.insert(courts).values(data);

    return {
      success: true,
      message: 'Berhasil membuat lapangan.',
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
