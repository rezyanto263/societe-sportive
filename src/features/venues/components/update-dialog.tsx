'use client';

import InputField from '@/components/app/form/input-field';
import SportIcon from '@/components/app/icon/sports';
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
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { VenuesSchema } from '@/features/venues/schema';
import { UpdateVenueData } from '@/features/venues/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircleIcon,
  PlusCircleIcon,
  SaveIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Sport } from '@/constants/sports';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Kbd } from '@/components/ui/kbd';
import { toast } from 'sonner';
import { JSX, useState, useTransition } from 'react';
import { Spinner } from '@/components/ui/spinner';
import CourtIcon from '@/components/app/icon/court';
import { useRouter } from 'next/navigation';
import { Venues } from '@/types/venues';
import { Sports } from '@/types/sport';
import { updateVenue } from '@/features/venues/actions/update-venue';

export default function UpdateVenueDialog({
  venue,
  sports,
  renderTrigger,
}: {
  venue: Venues;
  sports: Sports[];
  renderTrigger: JSX.Element;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();

  const defaultValues = {
    id: venue.id,
    sportId: venue.sportId,
    name: venue.name,
    address: venue.address,
    googleMapsUrl: venue.googleMapsUrl,
    phoneNumber: venue.phoneNumber,
    notes: venue.notes,
    facilities: venue.facilities ?? [],
    fee: Number(venue.fee),
    courts: venue.courts.map((court) => ({
      id: court.id,
      name: court.name,
      specifications: court.specifications ?? [],
    })),
  };

  const form = useForm<UpdateVenueData>({
    resolver: zodResolver(VenuesSchema.update),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'courts',
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      form.reset(defaultValues);
    }

    setOpen(nextOpen);
  };

  async function handleUpdate(data: UpdateVenueData) {
    startTransition(async () => {
      const { success, message } = await updateVenue(data);

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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={renderTrigger} />
      <DialogContent
        showCloseButton={false}
        className="max-h-[90dvh] overflow-hidden max-w-[calc(100%-24px)] md:max-w-2xl lg:max-w-3xl max-sm:px-3"
      >
        <DialogHeader className="shrink-0 px-3">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-bold">
              Ubah Tempat & Lapangan
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
            Ubah data tempat dan lapangan yang digunakan untuk pertandingan.
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
                      label="Nama Tempat"
                      required
                    />
                  )}
                />
              </div>

              <div className="col-span-12">
                <Controller
                  name="sportId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <InputField
                      field={field}
                      fieldState={fieldState}
                      label="Cabang Olahraga"
                      description="Cabang olahraga tidak dapat diubah setelah tempat dibuat."
                      required
                      render={({ field, fieldState }) => (
                        <RadioGroup
                          defaultValue={field.value}
                          data-invalid={fieldState.invalid}
                          className="flex items-center gap-3 max-md:flex-wrap"
                          disabled
                        >
                          {sports.map((s) => (
                            <FieldLabel
                              key={s.id}
                              htmlFor={s.id}
                              className="cursor-not-allowed"
                            >
                              <Field
                                orientation="horizontal"
                                data-invalid={fieldState.invalid}
                                className="items-center!"
                              >
                                <FieldContent>
                                  <FieldTitle className="capitalize">
                                    <SportIcon sportName={s.name as Sport} />{' '}
                                    {s.name}
                                  </FieldTitle>
                                </FieldContent>
                                <RadioGroupItem
                                  value={s.id}
                                  id={s.id}
                                  aria-invalid={fieldState.invalid}
                                />
                              </Field>
                            </FieldLabel>
                          ))}
                        </RadioGroup>
                      )}
                    />
                  )}
                />
              </div>

              <div className="col-span-12">
                <Controller
                  name="address"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <InputField
                      field={field}
                      fieldState={fieldState}
                      label="Alamat"
                      required
                    />
                  )}
                />
              </div>

              <div className="col-span-12">
                <Controller
                  name="googleMapsUrl"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <InputField
                      field={field}
                      fieldState={fieldState}
                      label="Tautan Google Maps"
                      required
                    />
                  )}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <Controller
                  name="phoneNumber"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <InputField
                      field={field}
                      fieldState={fieldState}
                      label="Nomor Ponsel"
                      type="tel"
                      required
                    />
                  )}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <Controller
                  name="fee"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <InputField
                      field={field}
                      fieldState={fieldState}
                      label="Harga Sewa (Rp / Jam)"
                      type="currency"
                      required
                    />
                  )}
                />
              </div>

              <div className="col-span-12">
                <div className="bg-input/20 rounded-3xl p-3 md:p-6 space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="space-y-3">
                      <span className="font-semibold flex items-center gap-3 text-base">
                        <CourtIcon className="size-7 shrink-0" /> Daftar
                        Lapangan Tersedia ({fields.length})
                      </span>
                      {form.formState.errors.courts?.message && (
                        <div className="flex items-center gap-2">
                          <AlertCircleIcon
                            className="text-destructive"
                            size={14}
                          />
                          <FieldError errors={[form.formState.errors.courts]} />
                        </div>
                      )}
                    </div>

                    <Button
                      type="button"
                      className="cursor-pointer"
                      variant="outline"
                      onClick={() =>
                        append({
                          id: null,
                          name: '',
                          specifications: [],
                        })
                      }
                    >
                      <PlusCircleIcon /> Tambah Lapangan
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-3 w-full rounded-3xl border bg-input/20 relative"
                    >
                      <div className="space-y-6 w-full p-3 md:p-6">
                        <Controller
                          control={form.control}
                          name={`courts.${index}.name`}
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
                          control={form.control}
                          name={`courts.${index}.specifications`}
                          render={({ field, fieldState }) => (
                            <InputField
                              field={field}
                              fieldState={fieldState}
                              label="Spesifikasi Lapangan"
                              description={
                                <>
                                  Tambahkan spesifikasi lapangan, lalu tekan{' '}
                                  <Kbd className="bg-input/50">⏎</Kbd> atau{' '}
                                  <Kbd className="bg-input/50">,</Kbd> untuk
                                  setiap spesifikasi.
                                </>
                              }
                              type="tags"
                            />
                          )}
                        />
                      </div>

                      {index !== 0 && (
                        <Button
                          className="absolute top-2 right-2 cursor-pointer"
                          variant="destructive"
                          size="icon-sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2Icon />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-12">
                <Controller
                  name="facilities"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <InputField
                      field={field}
                      fieldState={fieldState}
                      label="Fasilitas"
                      description={
                        <>
                          Tambahkan fasilitas yang tersedia, lalu tekan{' '}
                          <Kbd>⏎</Kbd> atau <Kbd>,</Kbd> untuk setiap fasilitas.
                        </>
                      }
                      type="tags"
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
                      label="Catatan Penting Lapangan"
                      type="richtext"
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
