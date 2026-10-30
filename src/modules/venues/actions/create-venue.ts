'use server';

import db from '@/core/database';
import { courts, venues } from '@/core/database/schema';
import { CreateVenueData } from '@/modules/venues/types';
import { auth } from '@/core/auth/server';
import { APIError } from 'better-auth';
import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { updateTag } from 'next/cache';
import { cacheTags } from '@/core/cache/tags';

export async function createVenue({
  courts: courtsData,
  ...venueData
}: CreateVenueData) {
  try {
    const { success: canCreateVenue } = await auth.api.userHasPermission({
      body: { permissions: { venues: ['create'] } },
      headers: await headers(),
    });

    if (!canCreateVenue) throw new APIError('FORBIDDEN');

    return db.transaction(async (tx) => {
      const [venue] = await tx
        .insert(venues)
        .values({ ...venueData, fee: venueData.fee.toString() })
        .returning({
          id: venues.id,
        });

      const courtsDataMapped = courtsData.map((c) => ({
        venueId: venue.id,
        ...c,
      }));

      await tx.insert(courts).values(courtsDataMapped).returning();

      updateTag(cacheTags.venues.list);

      return {
        success: true,
        message: 'Berhasil membuat tempat & lapangan baru.',
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
