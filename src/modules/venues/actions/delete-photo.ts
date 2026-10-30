'use server';

import db from '@/core/database';
import { medias, venueMedias } from '@/core/database/schema';
import { DeletePhotoData } from '@/modules/venues/types';
import { auth } from '@/core/auth/server';
import { APIError } from 'better-auth';
import { isAPIError } from 'better-auth/api';
import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { updateTag } from 'next/cache';
import { cacheTags } from '@/core/cache/tags';

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

    updateTag(cacheTags.venues.detail(venueId));

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
