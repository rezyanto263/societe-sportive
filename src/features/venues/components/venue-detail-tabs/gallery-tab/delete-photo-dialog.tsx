'use client';

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
import { deletePhoto } from '@/features/venues/actions/delete-photo';
import { VenuesSchema } from '@/features/venues/schema';
import { DeletePhotoData } from '@/features/venues/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2Icon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { JSX, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type DeletePhotoDialogProps = {
  venueId: string;
  mediaId: string;
  src: string;
  renderTrigger: JSX.Element;
};

export default function DeletePhotoDialog({
  venueId,
  mediaId,
  src,
  renderTrigger,
}: DeletePhotoDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<DeletePhotoData>({
    resolver: zodResolver(VenuesSchema.deletePhoto),
    defaultValues: { venueId, mediaId },
  });

  async function handleDelete(data: DeletePhotoData) {
    startTransition(async () => {
      const { success, message } = await deletePhoto(data);

      if (!success) {
        toast.error(message);
        return;
      }

      setOpen(false);
      toast.success(message);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={renderTrigger} />
      <DialogContent
        showCloseButton={false}
        className="max-h-[90dvh] overflow-hidden max-w-[calc(100%-24px)] max-sm:px-3"
      >
        <DialogHeader className="shrink-0 px-3">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-bold">Hapus Foto</DialogTitle>
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
            Foto ini akan dihapus permanen dari galeri foto. Apakah Anda yakin?
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleDelete)}
          className="flex min-h-0 flex-1 flex-col gap-6"
        >
          <ScrollArea className="*:data-[slot=scroll-area-viewport]:max-h-[calc(90dvh-14rem)]">
            <div className="aspect-video w-full overflow-hidden rounded-3xl relative">
              <Image src={src} alt="Foto" fill className="object-cover" />
            </div>
          </ScrollArea>
          <DialogFooter className="shrink-0 px-3">
            <Button
              type="submit"
              variant="destructive"
              className="w-full cursor-pointer"
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
