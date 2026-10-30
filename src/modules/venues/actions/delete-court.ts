'use server';

import db from '@/core/database';
import { courts } from '@/core/database/schema';
import { auth } from '@/core/auth/server';
import { APIError, isAPIError } from 'better-auth/api';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { updateTag } from 'next/cache';
import { cacheTags } from '@/core/cache/tags';

export async function deleteCourt(id: string) {
  try {
    const { success: canDeleteCourt } = await auth.api.userHasPermission({
      body: { permissions: { venues: ['update'] } },
      headers: await headers(),
    });

    if (!canDeleteCourt) throw new APIError('FORBIDDEN');

    let venueId: string;

    return db.transaction(async (tx) => {
      const court = await tx.query.courts.findFirst({
        where: { id, deletedAt: { isNull: true } },
      });

      if (!court) {
        throw new APIError('NOT_FOUND', {
          message: 'Lapangan tidak ditemukan.',
        });
      }

      venueId = court.venueId;

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

      updateTag(cacheTags.venues.detail(venueId));

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
