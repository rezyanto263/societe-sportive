'use client';

import { createPaymentAccount } from '@/modules/payment-accounts/actions/create-payment-account';
import PaymentAccountTypeInput from '@/modules/payment-accounts/components/payment-account-type-input';
import { PAYMENT_ACCOUNT_TYPES } from '@/modules/payment-accounts/constants';
import { PaymentAccountsSchema } from '@/modules/payment-accounts/schema';
import { CreatePaymentAccountData } from '@/modules/payment-accounts/types';
import InputField from '@/shared/components/app/form/input-field';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { FieldGroup } from '@/shared/components/ui/field';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Spinner } from '@/shared/components/ui/spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircleIcon, XIcon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

export default function CreatePaymentAccountDialog() {
  const [open, setOpen] = useState<boolean>(true);
  const [isLoading, startTransition] = useTransition();

  const defaultValues = {
    name: '',
    type: PAYMENT_ACCOUNT_TYPES.BANK,
    providerName: '',
    accountNumber: '',
    accountHolderName: '',
    imageId: null,
    bookmark: false,
    notes: '',
  };

  const form = useForm<CreatePaymentAccountData>({
    resolver: zodResolver(PaymentAccountsSchema.create),
    defaultValues,
  });

  const paymentType = useWatch({
    control: form.control,
    name: 'type',
  });

  const isQris = paymentType === PAYMENT_ACCOUNT_TYPES.QRIS;

  function handleCreate(data: CreatePaymentAccountData) {
    startTransition(async () => {
      const { success, message } = await createPaymentAccount(data);

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
    <Dialog open={open}>
      <Button
        type="button"
        className="cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <PlusCircleIcon /> Tambah Rekening
      </Button>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90dvh] overflow-hidden max-w-[calc(100%-24px)] md:max-w-2xl lg:max-w-3xl max-sm:px-3"
      >
        <DialogHeader className="shrink-0 px-3">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-bold">
              Tambah Rekening Pembayaran
            </DialogTitle>
            <Button
              variant="secondary"
              size="icon-sm"
              className="cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <XIcon />
            </Button>
          </div>
          <DialogDescription>
            Data ini disimpan agar dapat langsung dipilih saat penyelenggara
            membuat pertandingan.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex min-h-0 flex-1 flex-col gap-6"
          onSubmit={form.handleSubmit(handleCreate)}
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
                      required
                      render={({ field, fieldState }) => (
                        <PaymentAccountTypeInput
                          field={field}
                          fieldState={fieldState}
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
                        componentProps={{ dropzone: true }}
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
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner /> Memproses...
                </>
              ) : (
                <>
                  <PlusCircleIcon /> Tambah
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
