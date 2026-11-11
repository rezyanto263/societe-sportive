import CreatePaymentAccountDialog from '@/modules/payment-accounts/components/create-dialog';
import PaymentAccountFilters from '@/modules/payment-accounts/components/payment-account-filters';
import PaymentAccountFiltersSkeleton from '@/modules/payment-accounts/components/payment-account-filters/skeleton';
import PaymentAccountList from '@/modules/payment-accounts/components/payment-account-list';
import PaymentAccountListSkeleton from '@/modules/payment-accounts/components/payment-account-list/skeleton';
import PaymentAccountStats from '@/modules/payment-accounts/components/payment-account-stats';
import PaymentAccountStatsSkeleton from '@/modules/payment-accounts/components/payment-account-stats/skeleton';
import { getPaymentAccounts } from '@/modules/payment-accounts/queries/get-payment-accounts';
import { PaymentAccountsSchema } from '@/modules/payment-accounts/schema';
import RefreshButton from '@/shared/components/app/refresh-button';
import { Card } from '@/shared/components/ui/card';
import { CreditCardIcon } from 'lucide-react';
import { Suspense } from 'react';

type Props = {
  searchParams: Promise<{
    keyword?: string;
    type?: string;
    page?: string;
    limit?: string;
  }>;
};

export const instant = false;

export default async function PaymentAccountsPage({ searchParams }: Props) {
  const { page, limit, ...params } = await searchParams;

  const search = PaymentAccountsSchema.searchParams.safeParse({
    page: Number(page ?? 1),
    limit: Number(limit ?? 10),
    ...params,
  });

  const filters = search.success
    ? search.data
    : PaymentAccountsSchema.searchParams.parse({});

  const queryString = new URLSearchParams({
    ...filters,
    page: String(filters.page),
    limit: String(filters.limit),
  }).toString();

  const paymentAccountsPromise = getPaymentAccounts(filters);

  return (
    <div className="p-6 space-y-8">
      <Card className="p-6 flex-row justify-between max-lg:flex-col">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-green-700 font-bold uppercase">
            <CreditCardIcon className="size-5" />
            DATA PEMBAYARAN KOMUNITAS
          </div>
          <h1 className="inline-block text-3xl font-bold">
            Rekening Pembayaran
          </h1>
          <p className="text-muted-foreground">
            Simpan data nomor rekening bank, e-wallet, atau QRIS kas komunitas.
            Saat membuat game, Anda cukup memilih rekening yang sudah dibuat
            tanpa perlu menginput ulang secara manual.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RefreshButton />

          <CreatePaymentAccountDialog />
        </div>
      </Card>

      <Suspense fallback={<PaymentAccountStatsSkeleton />}>
        <PaymentAccountStats />
      </Suspense>

      <Suspense fallback={<PaymentAccountFiltersSkeleton />}>
        <PaymentAccountFilters
          paymentAccountsPromise={paymentAccountsPromise}
          queryString={queryString}
        />
      </Suspense>

      <Suspense fallback={<PaymentAccountListSkeleton />}>
        <PaymentAccountList paymentAccountsPromise={paymentAccountsPromise} />
      </Suspense>
    </div>
  );
}
