import { BanknoteIcon, LandmarkIcon, LucideProps, QrCodeIcon, WalletIcon } from 'lucide-react';
import { PaymentAccountType } from '@/modules/payment-accounts/types';

const PAYMENT_ACCOUNT_TYPE_ICONS: Record<PaymentAccountType, React.ComponentType<LucideProps>> = {
  bank: LandmarkIcon,
  qris: QrCodeIcon,
  "e-wallet": WalletIcon,
  cash: BanknoteIcon
};

type Props = LucideProps & { typeName: PaymentAccountType };

export default function PaymentAccountTypeIcon({ typeName, ...props }: Props) {
  const Icon = PAYMENT_ACCOUNT_TYPE_ICONS[typeName];

  return <Icon {...props} />;
}
