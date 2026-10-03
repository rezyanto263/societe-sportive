'use server';

import db from '@/database';
import { courts, venues } from '@/database/schema';
import { UpdateVenueData } from '@/features/venues/types';
import { auth } from '@/lib/auth';
import { APIError } from 'better-auth';
import { isAPIError } from 'better-auth/api';
import { eq } from 'drizzle-orm';
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

    return db.transaction(async (tx) => {
      await tx
        .update(venues)
        .set({ ...venueData, fee: venueData.fee.toString() })
        .where(eq(venues.id, venueData.id));

      // 2. Ambil court yang sudah ada di database
      const existingCourts = await tx
        .select()
        .from(courts)
        .where(eq(courts.venueId, venueData.id));

      const submittedCourtIds = new Set(
        courtsData
          .map((court) => court.id)
          .filter((id): id is string => Boolean(id)),
      );

      // 3. Update / Insert
      for (const court of courtsData) {
        if (court.id) {
          // Court sudah ada → update
          await tx
            .update(courts)
            .set({
              name: court.name,
              specifications: court.specifications,
            })
            .where(eq(courts.id, court.id));
        } else {
          // Court baru → insert
          await tx.insert(courts).values({
            venueId: venueData.id,
            name: court.name,
            specifications: court.specifications,
          });
        }
      }

      // 4. Delete court yang dihapus dari form
      const deletedCourtIds = existingCourts
        .map((court) => court.id)
        .filter((id) => !submittedCourtIds.has(id));

      for (const courtId of deletedCourtIds) {
        const usage = await tx.query.matchCourts.findFirst({
          where: { courtId: courtId },
        });

        if (!!usage) {
          // Sudah pernah digunakan → soft delete
          await tx
            .update(courts)
            .set({
              deletedAt: new Date(),
            })
            .where(eq(courts.id, courtId));
        } else {
          // Belum pernah digunakan → hard delete
          await tx.delete(courts).where(eq(courts.id, courtId));
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
