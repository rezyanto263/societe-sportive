'use server';

import { auth } from '@/core/auth/server';
import { cacheTags } from '@/core/cache/tags';
import db from '@/core/database';
import { paymentAccounts } from '@/core/database/schema';
import { ActionResult } from '@/core/types/action';
import { BookmarkPaymentAccountData } from '@/modules/payment-accounts/types';
import { APIError } from 'better-auth';
import { isAPIError } from 'better-auth/api';
import { eq } from 'drizzle-orm';
import { updateTag } from 'next/cache';
import { headers } from 'next/headers';

export async function bookmarkPaymentAccount({
  id,
  bookmark,
}: BookmarkPaymentAccountData): Promise<ActionResult> {
  try {
    const { success: canBookmarkPaymentAccount } =
      await auth.api.userHasPermission({
        body: { permissions: { paymentAccounts: ['bookmark'] } },
        headers: await headers(),
      });

    if (!canBookmarkPaymentAccount) throw new APIError('FORBIDDEN');

    await db
      .update(paymentAccounts)
      .set({ bookmark })
      .where(eq(paymentAccounts.id, id));

      updateTag(cacheTags.paymentAccounts.stats);
      updateTag(cacheTags.paymentAccounts.list);
      updateTag(cacheTags.paymentAccounts.detail(id));

    return {
      success: true,
      message: bookmark
        ? 'Berhasil menambahkan markah.'
        : 'Berhasil menghapus markah.',
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
