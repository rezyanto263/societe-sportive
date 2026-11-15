'use server';

import { auth } from '@/core/auth/server';
import { cacheTags } from '@/core/cache/tags';
import db from '@/core/database';
import { medias, paymentAccounts } from '@/core/database/schema';
import { ActionResult } from '@/core/types/action';
import { UpdatePaymentAccountData } from '@/modules/payment-accounts/types';
import { APIError } from 'better-auth';
import { isAPIError } from 'better-auth/api';
import { eq } from 'drizzle-orm';
import { updateTag } from 'next/cache';
import { headers } from 'next/headers';

export async function updatePaymentAccount({
  id,
  ...data
}: UpdatePaymentAccountData): Promise<ActionResult> {
  try {
    const { success: canUpdatePaymentAccount } =
      await auth.api.userHasPermission({
        body: { permissions: { paymentAccounts: ['update'] } },
        headers: await headers(),
      });

    if (!canUpdatePaymentAccount) throw new APIError('FORBIDDEN');

    const paymentAccount = await db.query.paymentAccounts.findFirst({
      where: { id: { eq: id }, deletedAt: { isNull: true } },
    });

    if (!paymentAccount) throw new APIError('NOT_FOUND');

    await db.transaction(async (tx) => {
      if (paymentAccount.imageId !== data.imageId) {
        if (paymentAccount.imageId) {
          await tx
            .update(medias)
            .set({ deletedAt: new Date() })
            .where(eq(medias.id, paymentAccount.imageId));
        }

        if (data.imageId) {
          await tx
            .update(medias)
            .set({ status: 'attached' })
            .where(eq(medias.id, data.imageId));
        }
      }

      await tx
        .update(paymentAccounts)
        .set(data)
        .where(eq(paymentAccounts.id, id));
    });

    updateTag(cacheTags.paymentAccounts.detail(id));
    updateTag(cacheTags.paymentAccounts.list);

    return {
      success: true,
      message: 'Berhasil memperbarui rekening pembayaran.',
    };
  } catch (error) {
    console.error(error);

    if (isAPIError(error)) {
      return { success: false, message: error.message };
    }

    return { success: false, message: 'Terjadi kesalahan.' };
  }
}
