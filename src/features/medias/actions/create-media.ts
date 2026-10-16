'use server';

import db from '@/database';
import { medias } from '@/database/schema';
import { CreateMediaData } from '@/features/medias/types';
import { isAPIError } from 'better-auth/api';

export async function createMedia(data: CreateMediaData) {
  try {
    const [media] = await db.insert(medias).values(data).returning();

    return {
      success: true,
      message: 'Berhasil mengunggah gambar.',
      data: media,
    };
  } catch (error) {
    console.log(error);

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
