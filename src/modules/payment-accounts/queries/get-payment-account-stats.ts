import { cacheTags } from '@/core/cache/tags';
import db from '@/core/database';
import { paymentAccounts } from '@/core/database/schema';
import { PAYMENT_ACCOUNT_TYPES } from '@/modules/payment-accounts/constants';
import { and, count, eq, isNull } from 'drizzle-orm';
import { cacheTag } from 'next/cache';
import { cacheLife } from 'next/cache';
import 'server-only';

export async function getPaymentAccountStats() {
  'use cache';

  cacheLife('days');
  cacheTag(cacheTags.paymentAccounts.stats);

  const [[{ totalPaymentAccounts }], [{ totalBookmarkPaymentAccounts }]] =
    await Promise.all([
      db
        .select({ totalPaymentAccounts: count() })
        .from(paymentAccounts)
        .where(isNull(paymentAccounts.deletedAt)),

      db
        .select({ totalBookmarkPaymentAccounts: count() })
        .from(paymentAccounts)
        .where(
          and(
            isNull(paymentAccounts.deletedAt),
            eq(paymentAccounts.bookmark, true),
          ),
        ),
    ]);

  return {
    totalPaymentAccounts: totalPaymentAccounts,
    totalBookmarkPaymentAccounts: totalBookmarkPaymentAccounts,
    totalPaymentAccountTypes: Object.keys(PAYMENT_ACCOUNT_TYPES).length,
  };
}
