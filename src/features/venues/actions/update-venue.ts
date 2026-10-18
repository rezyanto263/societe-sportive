'use server';

import db from '@/database';
import { courts, medias, venues } from '@/database/schema';
import { UpdateVenueData } from '@/features/venues/types';
import { auth } from '@/lib/auth';
import { APIError } from 'better-auth';
import { isAPIError } from 'better-auth/api';
import { and, eq, isNull } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function updateVenue({
  courts: courtsData,
  sportId: _,
  ...venueData
}: UpdateVenueData) {
  try {
    const { success: canUpdateVenue } = await auth.api.userHasPermission({
      body: { permissions: { venues: ['update'] } },
      headers: await headers(),
    });

    if (!canUpdateVenue) throw new APIError('FORBIDDEN');

    return await db.transaction(async (tx) => {
      const now = new Date();

      // Tandai media sebagai attached (harus ada dan belum dihapus).
      const attachMedia = async (mediaId: string) => {
        const updated = await tx
          .update(medias)
          .set({ status: 'attached', updatedAt: now })
          .where(and(eq(medias.id, mediaId), isNull(medias.deletedAt)))
          .returning({ id: medias.id });

        if (updated.length === 0) {
          throw new APIError('BAD_REQUEST', {
            message: 'Gambar tidak ditemukan.',
          });
        }
      };

      // Soft delete media lama.
      const softDeleteMedia = async (mediaId: string) => {
        await tx
          .update(medias)
          .set({ deletedAt: now, updatedAt: now })
          .where(and(eq(medias.id, mediaId), isNull(medias.deletedAt)));
      };

      await tx
        .update(venues)
        .set({ ...venueData, fee: venueData.fee.toString() })
        .where(eq(venues.id, venueData.id));

      // 2. Ambil court yang sudah ada di database
      const existingCourts = await tx
        .select()
        .from(courts)
        .where(eq(courts.venueId, venueData.id));

      const existingCourtMap = new Map(
        existingCourts.map((court) => [court.id, court]),
      );

      const submittedCourtIds = new Set(
        courtsData
          .map((court) => court.id)
          .filter((id): id is string => Boolean(id)),
      );

      // 3. Update / Insert
      for (const court of courtsData) {
        // Form mengirim '' saat gambar dihapus → ubah ke null.
        const newThumbnailId = court.thumbnailId || null;

        if (court.id) {
          // Ambil dari data DB, bukan dari client, sekaligus memastikan court ini memang milik venue tersebut.
          const existing = existingCourtMap.get(court.id);

          if (!existing) {
            throw new APIError('NOT_FOUND', {
              message: 'Lapangan tidak ditemukan.',
            });
          }

          const oldThumbnailId = existing.thumbnailId;

          // Thumbnail baru → attached
          if (newThumbnailId && newThumbnailId !== oldThumbnailId) {
            await attachMedia(newThumbnailId);
          }

          await tx
            .update(courts)
            .set({
              thumbnailId: newThumbnailId,
              name: court.name,
              specifications: court.specifications,
            })
            .where(eq(courts.id, court.id));

          // Thumbnail lama diganti atau dihapus → soft delete
          if (oldThumbnailId && oldThumbnailId !== newThumbnailId) {
            await softDeleteMedia(oldThumbnailId);
          }
        } else {
          // Court baru → insert
          if (newThumbnailId) await attachMedia(newThumbnailId);

          await tx.insert(courts).values({
            venueId: venueData.id,
            thumbnailId: newThumbnailId,
            name: court.name,
            specifications: court.specifications,
          });
        }
      }

      // 4. Delete court yang dihapus dari form
      const deletedCourts = existingCourts.filter(
        (court) => !submittedCourtIds.has(court.id),
      );

      for (const court of deletedCourts) {
        const usage = await tx.query.matchCourts.findFirst({
          where: { courtId: court.id },
        });

        if (usage) {
          // Sudah pernah digunakan → soft delete (thumbnail dipertahankan karena court masih dipakai sebagai riwayat)
          await tx
            .update(courts)
            .set({ deletedAt: now })
            .where(eq(courts.id, court.id));
        } else {
          // Belum pernah digunakan → hard delete
          await tx.delete(courts).where(eq(courts.id, court.id));

          if (court.thumbnailId) await softDeleteMedia(court.thumbnailId);
        }
      }

      return {
        success: true,
        message: 'Berhasil memperbarui tempat & lapangan.',
      };
    });
  } catch (error) {
    console.error(error);

    if (isAPIError(error)) {
      return { success: false, message: error.message };
    }

    return { success: false, message: 'Terjadi kesalahan.' };
  }
}
