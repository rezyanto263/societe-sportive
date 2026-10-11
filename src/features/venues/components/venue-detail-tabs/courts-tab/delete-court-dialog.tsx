import InputField from "@/components/app/form/input-field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogTitle, DialogTrigger, DialogContent, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { deleteCourt } from "@/features/venues/actions/delete-court";
import { VenuesSchema } from "@/features/venues/schema";
import { DeleteCourtData } from "@/features/venues/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2Icon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

export default function DeleteCourtDialog({
  id,
  name,
  renderTrigger,
}: {
  id: string;
  name: string;
  renderTrigger: React.JSX.Element;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();

  const defaultValues = { id, name: '' };

  const form = useForm<DeleteCourtData>({
    resolver: zodResolver(VenuesSchema.delete),
    defaultValues,
  });

  const confirmName = useWatch({
    control: form.control,
    name: 'name',
  });

  async function handleDelete(data: DeleteCourtData) {
    startTransition(async () => {
      const { success, message } = await deleteCourt(data.id);

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
              Hapus Lapangan
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
            <b>{name}</b> akan dihapus permanen dari daftar lapangan.
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
                    label="Konfirmasi Nama Lapangan"
                    description={
                      <span>
                        Ketik nama{' '}
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          className="h-6 p-0 cursor-pointer"
                          title="Salin"
                          onClick={() => navigator.clipboard.writeText(name)}
                        >
                          {name}
                        </Button>{' '}
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