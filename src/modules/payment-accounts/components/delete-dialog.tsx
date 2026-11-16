'use client';

import InputField from '@/shared/components/app/form/input-field';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Spinner } from '@/shared/components/ui/spinner';
import { deletePaymentAccount } from '@/modules/payment-accounts/actions/delete-payment-account';
import { PaymentAccountsSchema } from '@/modules/payment-accounts/schema';
import { DeletePaymentAccountData } from '@/modules/payment-accounts/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2Icon, XIcon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { JSX } from 'react/jsx-runtime';
import { toast } from 'sonner';
import CopyButton from '@/shared/components/app/copy-button';

export default function DeletePaymentAccountDialog({
  id,
  name,
  renderTrigger,
}: {
  id: string;
  name: string;
  renderTrigger: JSX.Element;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, startTransition] = useTransition();

  const defaultValues = { id, name: '' };

  const form = useForm<DeletePaymentAccountData>({
    resolver: zodResolver(PaymentAccountsSchema.delete),
    defaultValues,
  });

  const confirmName = useWatch({
    control: form.control,
    name: 'name',
  });

  async function handleDelete(data: DeletePaymentAccountData) {
    startTransition(async () => {
      const { success, message } = await deletePaymentAccount(data.id);

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={renderTrigger} />
      <DialogContent
        showCloseButton={false}
        className="max-h-[90dvh] overflow-hidden max-w-[calc(100%-24px)] md:max-w-lg max-sm:px-3"
      >
        <DialogHeader className="shrink-0 px-3">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-bold">
              Hapus Rekening Pembayaran
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
            <b>{name}</b> akan dihapus permanen dari daftar rekening pembayaran.
            Apakah Anda yakin?
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleDelete)}
          className="flex min-h-0 flex-1 flex-col gap-6"
        >
          <ScrollArea className="*:data-[slot=scroll-area-viewport]:max-h-[calc(90dvh-14rem)]">
            <div className="p-3">
              <Controller
                name="name"
                control={form.control}
                disabled={isLoading}
                render={({ field, fieldState }) => (
                  <InputField
                    field={field}
                    fieldState={fieldState}
                    label="Konfirmasi Nama Rekening"
                    description={
                      <span className="flex items-center">
                        Ketik nama{' '}
                        <CopyButton
                          type="button"
                          variant="link"
                          size="sm"
                          className="p-0 cursor-pointer mx-1"
                          text={name}
                          value={name}
                        />{' '}
                        untuk mengonfirmasi.
                      </span>
                    }
                    required
                  />
                )}
              />
            </div>
          </ScrollArea>
          <DialogFooter className="shrink-0 px-3">
            <Button
              type="submit"
              variant="destructive"
              className="w-full cursor-pointer"
              onClick={() => form.trigger()}
              disabled={isLoading || confirmName !== name}
            >
              {isLoading ? (
                <>
                  <Spinner /> Memproses...
                </>
              ) : (
                <>
                  <Trash2Icon /> Hapus
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
