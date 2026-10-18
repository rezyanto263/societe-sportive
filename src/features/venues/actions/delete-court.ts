'use server';

import db from '@/database';
import { courts } from '@/database/schema';
import { auth } from '@/lib/auth';
import { APIError, isAPIError } from 'better-auth/api';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function deleteCourt(id: string) {
  try {
    const { success: canDeleteCourt } = await auth.api.userHasPermission({
      body: { permissions: { venues: ['update'] } },
      headers: await headers(),
    });

    if (!canDeleteCourt) throw new APIError('FORBIDDEN');

    return db.transaction(async (tx) => {
      const court = await tx.query.courts.findFirst({
        where: { id, deletedAt: { isNull: true } },
      });

      if (!court) {
        throw new APIError('NOT_FOUND', {
          message: 'Lapangan tidak ditemukan.',
        });
      }

      const activeCourts = await tx.query.courts.findMany({
        where: { venueId: court.venueId, deletedAt: { isNull: true } },
      });

      if (activeCourts.length <= 1) {
        throw new APIError('BAD_REQUEST', {
          message: 'Lapangan terakhir tidak boleh dihapus.',
        });
      }

      const usage = await tx.query.matchCourts.findFirst({
        where: { courtId: id },
      });

      if (!!usage) {
        await tx
          .update(courts)
          .set({ deletedAt: new Date() })
          .where(eq(courts.id, id));
      } else {
        await tx.delete(courts).where(eq(courts.id, id));
      }

      return {
        success: true,
        message: 'Berhasil menghapus lapangan.',
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
