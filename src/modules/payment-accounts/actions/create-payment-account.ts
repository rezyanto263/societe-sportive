'use server';

import { auth } from '@/core/auth/server';
import { cacheTags } from '@/core/cache/tags';
import db from '@/core/database';
import { medias, paymentAccounts } from '@/core/database/schema';
import { Medias, PaymentAccounts } from '@/core/database/types';
import { ActionResult } from '@/core/types/action';
import { CreatePaymentAccountData } from '@/modules/payment-accounts/types';
import { isAPIError } from 'better-auth/api';
import { eq } from 'drizzle-orm';
import { updateTag } from 'next/cache';
import { headers } from 'next/headers';

export async function createPaymentAccount(
  data: CreatePaymentAccountData,
): Promise<ActionResult<PaymentAccounts>> {
  try {
    const { success: canCreatePaymentAccount } =
      await auth.api.userHasPermission({
        body: { permissions: { paymentAccounts: ['create'] } },
        headers: await headers(),
      });

    if (!canCreatePaymentAccount) throw new Error('FORBIDDEN');

    const paymentAccount = (
      await db.insert(paymentAccounts).values(data).returning()
    )[0];

    let image: Medias | null = null;

    if (data.imageId) {
      image = (
        await db
          .update(medias)
          .set({ status: 'attached' })
          .where(eq(medias.id, data.imageId))
          .returning()
      )[0];
    }

    updateTag(cacheTags.paymentAccounts.list);

    return {
      success: true,
      message: 'Berhasil membuat akun pembayaran baru.',
      data: { ...paymentAccount, image: image },
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
