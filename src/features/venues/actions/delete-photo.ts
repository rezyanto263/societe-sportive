'use server';

import db from '@/database';
import { medias, venueMedias } from '@/database/schema';
import { DeletePhotoData } from '@/features/venues/types';
import { auth } from '@/lib/auth';
import { APIError } from 'better-auth';
import { isAPIError } from 'better-auth/api';
import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function deletePhoto({ venueId, mediaId }: DeletePhotoData) {
  try {
    const { success: canDeletePhoto } = await auth.api.userHasPermission({
      body: { permissions: { venues: ['update'] } },
      headers: await headers(),
    });

    if (!canDeletePhoto) throw new APIError('FORBIDDEN');

    await db.transaction(async (tx) => {
      const removed = await tx
        .delete(venueMedias)
        .where(
          and(
            eq(venueMedias.venueId, venueId),
            eq(venueMedias.mediaId, mediaId),
          ),
        )
        .returning({ mediaId: venueMedias.mediaId });

      // Foto memang tidak terpasang di venue ini: jangan sentuh tabel medias
      if (removed.length === 0) {
        throw new APIError('NOT_FOUND', { message: 'Foto tidak ditemukan.' });
      }

      await tx
        .update(medias)
        .set({ deletedAt: new Date() })
        .where(eq(medias.id, mediaId));
    });

    return {
      success: true,
      message: 'Berhasil menghapus foto.',
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
