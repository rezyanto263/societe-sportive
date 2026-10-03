'use server';

import db from '@/database';
import { courts, venues } from '@/database/schema';
import { auth } from '@/lib/auth';
import { APIError, isAPIError } from 'better-auth/api';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function deleteVenue(id: string) {
  try {
    const { success: canDeleteVenue } = await auth.api.userHasPermission({
      body: { permissions: { venues: ['delete'] } },
      headers: await headers(),
    });

    if (!canDeleteVenue) throw new APIError('FORBIDDEN');

    return db.transaction(async (tx) => {
      const isVenueExists = await tx.query.venues.findFirst({ where: { id } });

      if (!isVenueExists) throw new APIError('NOT_FOUND', {message: 'Tempat & Lapangan tidak ditemukan'});

      await tx.update(venues).set({deletedAt: new Date()}).where(eq(venues.id, id));
      await tx.update(courts).set({deletedAt: new Date()}).where(eq(courts.venueId, id));

      return {
        success: true,
        message: 'Berhasil menghapus tempat & lapangan.'
      }
    });
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
