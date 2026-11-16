'use server';

import { auth } from '@/core/auth/server';
import { cacheTags } from '@/core/cache/tags';
import db from '@/core/database';
import {
  matchPaymentAccounts,
  medias,
  paymentAccounts,
} from '@/core/database/schema';
import { ActionResult } from '@/core/types/action';
import { APIError, isAPIError } from 'better-auth/api';
import { count, eq } from 'drizzle-orm';
import { updateTag } from 'next/cache';
import { headers } from 'next/headers';

export async function deletePaymentAccount(id: string): Promise<ActionResult> {
  try {
    const { success: canDeletePaymentAccount } =
      await auth.api.userHasPermission({
        body: { permissions: { paymentAccounts: ['delete'] } },
        headers: await headers(),
      });

    if (!canDeletePaymentAccount) throw new APIError('FORBIDDEN');

    const [paymentAccount, [{ count: matchCount }]] = await Promise.all([
      db.query.paymentAccounts.findFirst({
        where: { id: { eq: id }, deletedAt: { isNull: true } },
      }),

      db
        .select({ count: count() })
        .from(matchPaymentAccounts)
        .where(eq(matchPaymentAccounts.paymentAccountId, id)),
    ]);

    if (!paymentAccount) throw new APIError('NOT_FOUND');

    const now = new Date();

    await db.transaction(async (tx) => {
      if (matchCount > 0) {
        await tx
          .update(paymentAccounts)
          .set({ deletedAt: now })
          .where(eq(paymentAccounts.id, id));
      } else {
        await tx.delete(paymentAccounts).where(eq(paymentAccounts.id, id));
      }

      if (paymentAccount.imageId) {
        await tx
          .update(medias)
          .set({ deletedAt: now })
          .where(eq(medias.id, paymentAccount.imageId));
      }
    });

    updateTag(cacheTags.paymentAccounts.detail(id));
    updateTag(cacheTags.paymentAccounts.list);

    return {
      success: true,
      message: 'Berhasil menghapus rekening pembayaran.',
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
