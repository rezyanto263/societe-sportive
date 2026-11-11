import { getPaymentAccountStats } from '@/modules/payment-accounts/queries/get-payment-account-stats';
import { Card, CardContent } from '@/shared/components/ui/card';
import { BookmarkCheckIcon, CreditCardIcon, WalletCardsIcon } from 'lucide-react';

export default async function PaymentAccountStats() {
  const {
    totalPaymentAccounts,
    totalBookmarkPaymentAccounts,
    totalPaymentAccountTypes,
  } = await getPaymentAccountStats();

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card>
        <CardContent className="flex items-center gap-3">
          <div className="p-3.5 bg-green-700/20 rounded-xl">
            <CreditCardIcon className="text-green-700 size-7" />
          </div>
          <div className="text-muted-foreground flex flex-col gap-1">
            <span>TOTAL REKENING PEMBAYARAN</span>
            <span>
              <span className="text-primary font-bold text-3xl mr-1">
                {totalPaymentAccounts}
              </span>{' '}
              rekening
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-3">
          <div className="p-3.5 bg-blue-700/20 rounded-xl">
            <BookmarkCheckIcon className="text-blue-700 size-7" />
          </div>
          <div className="text-muted-foreground flex flex-col gap-1">
            <span>TOTAL MARKAH REKENING</span>
            <span>
              <span className="text-primary font-bold text-3xl mr-1">
                {totalBookmarkPaymentAccounts}
              </span>{' '}
              rekening
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-3">
          <div className="p-3.5 bg-yellow-700/20 rounded-xl">
            <WalletCardsIcon className="text-yellow-700 size-7" />
          </div>
          <div className="text-muted-foreground flex flex-col gap-1">
            <span>TOTAL JENIS REKENING</span>
            <span>
              <span className="text-primary font-bold text-3xl mr-1">
                {totalPaymentAccountTypes}
              </span>{' '}
              jenis
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
