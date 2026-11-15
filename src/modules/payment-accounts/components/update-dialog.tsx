'use client';

import InputField from '@/shared/components/app/form/input-field';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { FieldGroup } from '@/shared/components/ui/field';
import { PaymentAccountsSchema } from '@/modules/payment-accounts/schema';
import { UpdatePaymentAccountData } from '@/modules/payment-accounts/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon, XIcon } from 'lucide-react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { toast } from 'sonner';
import { JSX, useState, useTransition } from 'react';
import { Spinner } from '@/shared/components/ui/spinner';
import { PaymentAccounts } from '@/core/database/types';
import { updatePaymentAccount } from '@/modules/payment-accounts/actions/update-payment-account';
import { PAYMENT_ACCOUNT_TYPES } from '@/modules/payment-accounts/constants';
import PaymentAccountTypeInput from '@/modules/payment-accounts/components/payment-account-type-input';

export default function UpdatePaymentAccountDialog({
  paymentAccount,
  renderTrigger,
}: {
  paymentAccount: PaymentAccounts;
  renderTrigger: JSX.Element;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, startTransition] = useTransition();

  const defaultValues = {
    id: paymentAccount.id,
    name: paymentAccount.name,
    type: paymentAccount.type,
    providerName: paymentAccount.providerName,
    accountNumber: paymentAccount.accountNumber,
    accountHolderName: paymentAccount.accountHolderName,
    imageId: paymentAccount.imageId,
    bookmark: paymentAccount.bookmark,
    notes: paymentAccount.notes,
  };

  const form = useForm<UpdatePaymentAccountData>({
    resolver: zodResolver(PaymentAccountsSchema.update),
    defaultValues,
  });

  const paymentType = useWatch({
    control: form.control,
    name: 'type',
  });

  const isQris = paymentType === PAYMENT_ACCOUNT_TYPES.QRIS;

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      form.reset(defaultValues);
    }

    setOpen(nextOpen);
  };

  async function handleUpdate(data: UpdatePaymentAccountData) {
    startTransition(async () => {
      const { success, message } = await updatePaymentAccount(data);

      if (!success) {
        toast.error(message);
        return;
      }

      setOpen(false);
      form.reset(defaultValues);
      toast.success(message);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={renderTrigger} />
      <DialogContent
        showCloseButton={false}
        className="max-h-[90dvh] overflow-hidden max-w-[calc(100%-24px)] md:max-w-2xl lg:max-w-3xl max-sm:px-3"
      >
        <DialogHeader className="shrink-0 px-3">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-bold">
              Ubah Rekening Pembayaran
            </DialogTitle>
            <Button
              variant="secondary"
              size="icon-sm"
              className="cursor-pointer"
              onClick={() => handleOpenChange(false)}
            >
              <XIcon />
            </Button>
          </div>
          <DialogDescription>
            Ubah data rekening pembayaran yang digunakan untuk pertandingan.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleUpdate)}
          className="flex min-h-0 flex-1 flex-col gap-6"
        >
          <ScrollArea className="*:data-[slot=scroll-area-viewport]:max-h-[calc(90dvh-14rem)]">
            <FieldGroup className="grid grid-cols-12 gap-6 p-3">
              <div className="col-span-12">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <InputField
                      field={field}
                      fieldState={fieldState}
                      label="Nama / Judul Rekening"
                      required
                    />
                  )}
                />
              </div>

              <div className="col-span-12">
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <InputField
                      field={field}
                      fieldState={fieldState}
                      label="Jenis Rekening"
                      description="Jenis rekening tidak dapat diubah setelah rekening pembayaran dibuat."
                      required
                      render={({ field, fieldState }) => (
                        <PaymentAccountTypeInput
                          field={field}
                          fieldState={fieldState}
                          disabled
                        />
                      )}
                    />
                  )}
                />
              </div>

              {isQris && (
                <div className="col-span-12">
                  <Controller
                    name="imageId"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <InputField
                        field={field}
                        fieldState={fieldState}
                        label="Gambar QRIS"
                        type="image"
                        componentProps={{
                          dropzone: true,
                          initialImages: [paymentAccount.image],
                        }}
                        required
                      />
                    )}
                  />
                </div>
              )}

              <div className="col-span-12">
                <Controller
                  name="providerName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <InputField
                      field={field}
                      fieldState={fieldState}
                      label="Nama Penyedia Layanan"
                      required
                    />
                  )}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <Controller
                  name="accountNumber"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <InputField
                      field={field}
                      fieldState={fieldState}
                      label="Nomor Rekening"
                      required
                    />
                  )}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <Controller
                  name="accountHolderName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <InputField
                      field={field}
                      fieldState={fieldState}
                      label="Nama Pemilik Rekening"
                      required
                    />
                  )}
                />
              </div>

              <div className="col-span-12">
                <Controller
                  name="bookmark"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <InputField
                      field={field}
                      fieldState={fieldState}
                      label="Jadikan Rekening Pembayaran Favorit"
                      type="checkbox"
                      componentProps={{ id: field.name }}
                    />
                  )}
                />
              </div>

              <div className="col-span-12">
                <Controller
                  name="notes"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <InputField
                      field={field}
                      fieldState={fieldState}
                      label="Catatan untuk Pembayaran"
                      type="textarea"
                    />
                  )}
                />
              </div>
            </FieldGroup>
          </ScrollArea>
          <DialogFooter className="shrink-0 px-3">
            <Button
              type="submit"
              className="w-full cursor-pointer"
              onClick={() => form.trigger()}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner /> Memproses...
                </>
              ) : (
                <>
                  <SaveIcon /> Simpan Perubahan
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
