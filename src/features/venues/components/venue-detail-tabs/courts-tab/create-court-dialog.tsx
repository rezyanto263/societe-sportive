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
import { Kbd } from '@/components/ui/kbd';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { createCourt } from '@/features/venues/actions/create-court';
import { VenuesSchema } from '@/features/venues/schema';
import { CreateCourtData } from '@/features/venues/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircleIcon, XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function CreateCourtDialog({
  venueId,
  name,
  renderTrigger,
}: {
  venueId: string;
  name: string;
  renderTrigger: React.JSX.Element;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();

  const defaultValues = {
    venueId,
    thumbnailId: '',
    name: '',
    specifications: [],
  };

  const form = useForm<CreateCourtData>({
    resolver: zodResolver(VenuesSchema.createCourt),
    defaultValues,
  });

  async function handleCreate(data: CreateCourtData) {
    startTransition(async () => {
      const { success, message } = await createCourt(data);

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
        className="max-h-[90dvh] overflow-hidden max-w-[calc(100%-24px)] md:max-w-lg max-sm:px-3"
      >
        <DialogHeader className="shrink-0 px-3">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-bold">
              Tambah Lapangan
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
            Tambah lapangan yang tersedia di <b>{name}</b>.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleCreate)}
          className="flex min-h-0 flex-1 flex-col gap-6"
        >
          <ScrollArea className="*:data-[slot=scroll-area-viewport]:max-h-[calc(90dvh-14rem)]">
            <div className="p-3 space-y-6">
              <Controller
                name="thumbnailId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <InputField
                    field={field}
                    fieldState={fieldState}
                    label="Gambar Lapangan"
                    type="image"
                  />
                )}
              />
              <Controller
                name="name"
                control={form.control}
                disabled={isLoading}
                render={({ field, fieldState }) => (
                  <InputField
                    field={field}
                    fieldState={fieldState}
                    label="Nama Lapangan"
                    required
                  />
                )}
              />
              <Controller
                name="specifications"
                control={form.control}
                disabled={isLoading}
                render={({ field, fieldState }) => (
                  <InputField
                    field={field}
                    fieldState={fieldState}
                    label="Spesifikasi Lapangan"
                    description={
                      <>
                        Tambahkan spesifikasi lapangan, lalu tekan{' '}
                        <Kbd className="bg-input/50">⏎</Kbd> atau{' '}
                        <Kbd className="bg-input/50">,</Kbd> untuk setiap
                        spesifikasi.
                      </>
                    }
                    type="tags"
                    required
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
                  <PlusCircleIcon /> Tambah Lapangan
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
