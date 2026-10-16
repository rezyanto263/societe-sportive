'use server';

import { auth } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';
import db from '@/database';
import { medias } from '@/database/schema';
import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function cleanupPendingMedia(mediaId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: 'Silakan masuk ke akun terlebih dahulu.',
    };
  }

  // Ambil hanya media pending milik pengguna.
  const [media] = await db
    .select()
    .from(medias)
    .where(and(eq(medias.id, mediaId), eq(medias.status, 'pending')))
    .limit(1);

  if (!media) {
    return {
      success: false,
      message: 'Media tidak ditemukan atau tidak dapat dihapus.',
    };
  }

  // Hapus aset Cloudinary.
  await cloudinary.uploader.destroy(media.publicId, {
    resource_type: 'image',
    invalidate: true,
  });

  // Hapus record database.
  await db
    .delete(medias)
    .where(and(eq(medias.id, media.id), eq(medias.status, 'pending')));

  return {
    success: true,
    message: 'Media berhasil dibersihkan.',
  };
}
