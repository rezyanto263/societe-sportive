import CreatePaymentAccountDialog from '@/modules/payment-accounts/components/create-dialog';
import RefreshButton from '@/shared/components/app/refresh-button';
import { Card } from '@/shared/components/ui/card';
import { CreditCardIcon } from 'lucide-react';

export default function PaymentAccountsPage() {
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
    </div>
  );
}
