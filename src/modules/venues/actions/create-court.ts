'use server';

import db from '@/core/database';
import { courts } from '@/core/database/schema';
import { CreateCourtData } from '@/modules/venues/types';
import { auth } from '@/core/auth/server';
import { APIError } from 'better-auth';
import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { updateTag } from 'next/cache';
import { cacheTags } from '@/core/cache/tags';

export async function createCourt(data: CreateCourtData) {
  try {
    const { success: canCreateCourt } = await auth.api.userHasPermission({
      body: { permissions: { venues: ['update'] } },
      headers: await headers(),
    });

    if (!canCreateCourt) throw new APIError('FORBIDDEN');

    await db.insert(courts).values(data);

    updateTag(cacheTags.venues.detail(data.venueId));

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
