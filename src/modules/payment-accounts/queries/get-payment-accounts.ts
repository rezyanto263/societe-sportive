import { cacheTags } from '@/core/cache/tags';
import db from '@/core/database';
import { paymentAccounts } from '@/core/database/schema';
import { SearchPaymentAccountParamsData } from '@/modules/payment-accounts/types';
import { and, count, eq, ilike, isNull, or } from 'drizzle-orm';
import { cacheTag } from 'next/cache';
import { cacheLife } from 'next/cache';

export async function getPaymentAccounts({
  keyword,
  type,
  page = 1,
  limit = 10,
}: SearchPaymentAccountParamsData) {
  'use cache';

  cacheLife('days');
  cacheTag(cacheTags.paymentAccounts.list);

  const normalizedKeyword = keyword?.trim();

  const [data, [{ total }]] = await Promise.all([
    db.query.paymentAccounts.findMany({
      with: { image: true },
      where: {
        ...(normalizedKeyword && {
          OR: [
            { name: { ilike: `%${normalizedKeyword}%` } },
            { providerName: { ilike: `%${normalizedKeyword}%` } },
            { accountNumber: { ilike: `%${normalizedKeyword}%` } },
            { accountHolderName: { ilike: `%${normalizedKeyword}%` } },
          ],
        }),
        ...(type && { type }),
        deletedAt: { isNull: true },
      },
      orderBy: { name: 'asc', id: 'asc' },
      offset: (page - 1) * limit,
      limit,
    }),

    db
      .select({ total: count() })
      .from(paymentAccounts)
      .where(
        and(
          normalizedKeyword
            ? or(
                ilike(paymentAccounts.name, `%${normalizedKeyword}%`),
                ilike(paymentAccounts.providerName, `%${normalizedKeyword}%`),
                ilike(paymentAccounts.accountNumber, `%${normalizedKeyword}%`),
                ilike(
                  paymentAccounts.accountHolderName,
                  `%${normalizedKeyword}%`,
                ),
              )
            : undefined,
          type ? eq(paymentAccounts.type, type) : undefined,
          isNull(paymentAccounts.deletedAt),
        ),
      ),
  ]);

  return {
    data,
    metadata: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
}
