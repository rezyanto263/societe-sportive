'use client';

import InputField from '@/components/app/form/input-field';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { Medias } from '@/database/types';
import { syncPhoto } from '@/features/venues/actions/sync-photo';
import { VenuesSchema } from '@/features/venues/schema';
import { SyncPhotoData } from '@/features/venues/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon, XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { JSX, useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

type ManagePhotoDialogProps = {
  venueId: string;
  name: string;
  medias: Medias[];
  renderTrigger: JSX.Element;
};

export default function ManagePhotoDialog({
  venueId,
  name,
  medias,
  renderTrigger,
}: ManagePhotoDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();

  const defaultValues = {
    venueId,
    mediaIds: medias.map((media) => media.id),
  };

  const form = useForm<SyncPhotoData>({
    resolver: zodResolver(VenuesSchema.syncPhoto),
    defaultValues,
  });

  async function handleCreate(data: SyncPhotoData) {
    startTransition(async () => {
      const { success, message } = await syncPhoto(data);

      if (!success) {
        toast.error(message);
        return;
      }

      setOpen(false);
      form.reset(defaultValues);
      toast.success(message);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={renderTrigger} />
      <DialogContent
        showCloseButton={false}
        className="max-h-[90dvh] overflow-hidden max-w-[calc(100%-24px)] md:max-w-2xl max-sm:px-3"
      >
        <DialogHeader className="shrink-0 px-3">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-bold">
              Manajemen Galeri Foto
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
            Tambahkan foto untuk menampilkan tempat dan lapangan di{' '}
            <b>{name}</b> agar lebih mudah dikenali.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleCreate)}
          className="flex min-h-0 flex-1 flex-col gap-6"
        >
          <ScrollArea className="*:data-[slot=scroll-area-viewport]:max-h-[calc(90dvh-14rem)]">
            <div className="p-3 space-y-6">
              <Controller
                name="mediaIds"
                control={form.control}
                render={({ field, fieldState }) => (
                  <InputField
                    field={field}
                    fieldState={fieldState}
                    label="Galeri Foto"
                    type="image"
                    componentProps={{
                      dropzone: true,
                      multiple: true,
                      maxFiles: 1000,
                      initialImages: medias,
                    }}
                  />
                )}
              />
            </div>
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
