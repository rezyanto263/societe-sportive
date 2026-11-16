'use client';

import { PaymentAccounts } from '@/core/database/types';
import { Metadata } from '@/core/types/query';
import { bookmarkPaymentAccount } from '@/modules/payment-accounts/actions/bookmark-payment-account';
import DeletePaymentAccountDialog from '@/modules/payment-accounts/components/delete-dialog';
import PaymentAccountPagination from '@/modules/payment-accounts/components/payment-account-list/payment-account-pagination';
import UpdatePaymentAccountDialog from '@/modules/payment-accounts/components/update-dialog';
import { PAYMENT_ACCOUNT_TYPES } from '@/modules/payment-accounts/constants';
import { PaymentAccountsSchema } from '@/modules/payment-accounts/schema';
import { BookmarkPaymentAccountData } from '@/modules/payment-accounts/types';
import CopyButton from '@/shared/components/app/copy-button';
import PaymentAccountTypeIcon from '@/shared/components/app/icon/payment-account-types';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/components/ui/empty';
import { Separator } from '@/shared/components/ui/separator';
import { Toggle } from '@/shared/components/ui/toggle';
import {
  BookmarkIcon,
  ChevronRightIcon,
  CreditCardIcon,
  Edit2Icon,
  ExternalLinkIcon,
  QrCodeIcon,
  Trash2Icon,
} from 'lucide-react';
import Link from 'next/link';
import { use, useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';

type Props = {
  paymentAccountsPromise: Promise<{
    data: PaymentAccounts[];
    metadata: Metadata;
  }>;
};

export default function PaymentAccountList({ paymentAccountsPromise }: Props) {
  const { data: paymentAccounts, metadata } = use(paymentAccountsPromise);
  const [isBookmarkPending, startBookmarkTransition] = useTransition();

  const [optimisticBookmarks, setOptimisticBookmarks] = useOptimistic(
    paymentAccounts,
    (state, updated: BookmarkPaymentAccountData) =>
      state.map((account) =>
        account.id === updated.id
          ? { ...account, bookmark: updated.bookmark }
          : account,
      ),
  );

  if (paymentAccounts.length === 0) {
    return (
      <Empty className="mx-auto">
        <EmptyHeader className="max-w-lg">
          <EmptyMedia variant="icon">
            <CreditCardIcon />
          </EmptyMedia>

          <EmptyTitle>Belum Ada Rekening Pembayaran</EmptyTitle>

          <EmptyDescription>
            Belum ada rekening pembayaran yang ditambahkan. Tambahkan rekening
            pembayaran untuk mulai mengelola pertandingan.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  async function handleBookmark(data: BookmarkPaymentAccountData) {
    const parsed = PaymentAccountsSchema.bookmark.safeParse(data);

    if (!parsed.success) {
      toast.error('Terjadi kesalahan.');
      return;
    }

    try {
      setOptimisticBookmarks(parsed.data);

      const result = await bookmarkPaymentAccount(parsed.data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    } catch {
      toast.error('Terjadi kesalahan saat memperbarui markah.');
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {optimisticBookmarks.map((paymentAccount) => (
        <Card key={paymentAccount.id} className="pb-0">
          <CardHeader className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="uppercase">
                <PaymentAccountTypeIcon typeName={paymentAccount.type} />
                {paymentAccount.type}
              </Badge>
              {paymentAccount.bookmark && (
                <Badge>
                  <BookmarkIcon /> Markah
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              <UpdatePaymentAccountDialog
                paymentAccount={paymentAccount}
                renderTrigger={
                  <Button
                    size="icon-xs"
                    variant="secondary"
                    className="cursor-pointer"
                  >
                    <Edit2Icon />
                  </Button>
                }
              />
              <DeletePaymentAccountDialog
                id={paymentAccount.id}
                name={paymentAccount.name}
                renderTrigger={
                  <Button
                    size="icon-xs"
                    variant="secondary"
                    className="cursor-pointer"
                  >
                    <Trash2Icon />
                  </Button>
                }
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <CardTitle className="font-bold text-xl">
                {paymentAccount.name}
              </CardTitle>
              <CardDescription className="flex items-center text-sm gap-1">
                <PaymentAccountTypeIcon
                  typeName={paymentAccount.type}
                  className="size-4"
                />
                {paymentAccount.providerName}
              </CardDescription>
            </div>
            <div className="rounded-3xl p-4 bg-muted flex items-center justify-between gap-3 flex-wrap">
              <div className="space-y-1">
                <span className="text-xs font-medium block text-muted-foreground">
                  NOMOR REKENING
                </span>
                <span className="text-lg tracking-widest font-bold text-primary">
                  {paymentAccount.accountNumber}
                </span>
              </div>
              <CopyButton
                value={paymentAccount.accountNumber.toString()}
                variant="outline"
                size="sm"
                className="cursor-pointer"
                text="Salin"
                successText="Tersalin"
                showTooltip={false}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <span>Atas Nama :</span>
              <span className="font-bold">
                {paymentAccount.accountHolderName}
              </span>
            </div>
            {paymentAccount.notes && (
              <div className="rounded-3xl p-4 bg-muted/70 text-xs space-y-1">
                <span className="font-bold mr-1">
                  Catatan untuk pembayaran:
                </span>
                <span>{paymentAccount.notes}</span>
              </div>
            )}
            {paymentAccount.type === PAYMENT_ACCOUNT_TYPES.QRIS && (
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="flex items-center gap-2">
                  <QrCodeIcon className="size-5" />
                  Kode QRIS tersedia
                </span>
                {paymentAccount.image?.url && (
                  <Link href={paymentAccount.image.url} target="_blank">
                    <Button variant="link" size="sm" className="cursor-pointer">
                      Lihat QRIS <ExternalLinkIcon />
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-muted py-3 justify-between mt-auto">
            <Toggle
              className="cursor-pointer"
              size="sm"
              pressed={paymentAccount.bookmark}
              disabled={isBookmarkPending}
              onPressedChange={() =>
                startBookmarkTransition(() =>
                  handleBookmark({
                    id: paymentAccount.id,
                    bookmark: !paymentAccount.bookmark,
                  }),
                )
              }
            >
              <BookmarkIcon
                fill={paymentAccount.bookmark ? 'var(--primary)' : 'none'}
              />
              {paymentAccount.bookmark
                ? 'Hapus dari markah'
                : 'Tambahkan ke markah'}
            </Toggle>
            <Link href="/dashboard/matches">
              <Button size="xs" className="cursor-pointer">
                Gunakan di Pertandingan <ChevronRightIcon />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}

      <PaymentAccountPagination metadata={metadata} />
    </div>
  );
}
