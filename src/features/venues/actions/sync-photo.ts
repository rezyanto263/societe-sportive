'use server';

import db from '@/database';
import { medias, venueMedias } from '@/database/schema';
import { SyncPhotoData } from '@/features/venues/types';
import { auth } from '@/lib/auth';
import { APIError } from 'better-auth';
import { isAPIError } from 'better-auth/api';
import { and, eq, inArray, isNull, notInArray } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function syncPhoto({ venueId, mediaIds }: SyncPhotoData) {
  try {
    const { success: canCreatePhoto } = await auth.api.userHasPermission({
      body: { permissions: { venues: ['update'] } },
      headers: await headers(),
    });

    if (!canCreatePhoto) throw new APIError('FORBIDDEN');

    const finalMediaIds = [...new Set(mediaIds)];

    await db.transaction(async (tx) => {
      // 1. Lepas semua relasi yang TIDAK ada di daftar akhir
      const removed = await tx
        .delete(venueMedias)
        .where(
          and(
            eq(venueMedias.venueId, venueId),
            finalMediaIds.length > 0
              ? notInArray(venueMedias.mediaId, finalMediaIds)
              : undefined,
          ),
        )
        .returning({ mediaId: venueMedias.mediaId });

      // 2. Soft delete media yang dilepas
      if (removed.length > 0) {
        await tx
          .update(medias)
          .set({ deletedAt: new Date() })
          .where(
            and(
              inArray(
                medias.id,
                removed.map((r) => r.mediaId),
              ),
              isNull(medias.deletedAt),
            ),
          );
      }

      if (finalMediaIds.length > 0) {
        // 3. Pasang semua yang ada di daftar akhir (yang sudah ada dilewati)
        await tx
          .insert(venueMedias)
          .values(finalMediaIds.map((mediaId) => ({ venueId, mediaId })))
          .onConflictDoNothing({
            target: [venueMedias.venueId, venueMedias.mediaId],
          });

        // 4. Pastikan semuanya attached dan tidak soft-deleted
        await tx
          .update(medias)
          .set({ status: 'attached', deletedAt: null })
          .where(inArray(medias.id, finalMediaIds));
      }
    });

    return {
      success: true,
      message: 'Berhasil menyimpan foto.',
    };
  } catch (error) {
    console.error(error);

    if (isAPIError(error)) {
      return { success: false, message: error.message };
    }

    return { success: false, message: 'Terjadi kesalahan.' };
  }
}
