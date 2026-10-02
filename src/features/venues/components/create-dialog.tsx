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
import { CreateVenueData } from '@/features/venues/types';
import { Sports } from '@/types/sport'; 
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircleIcon,
  PlusCircleIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Sport } from '@/constants/sports';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Kbd } from '@/components/ui/kbd';
import { createVenue } from '@/features/venues/actions/create-venue';
import { toast } from 'sonner';
import { useState, useTransition } from 'react';
import { Spinner } from '@/components/ui/spinner';
import CourtIcon from '@/components/app/icon/court';

export default function CreateVenueDialog({ sports }: { sports: Sports[] }) {
  const [open, setOpen] = useState(false);
  const [isLoading, startTransition] = useTransition();

  const defaultValues = {
    sportId: sports[0].id,
    name: '',
    address: '',
    googleMapsUrl: '',
    phoneNumber: '',
    notes: '',
    facilities: [],
    courts: [{ name: '', specifications: [] }],
  };
  
  const form = useForm<CreateVenueData>({
    resolver: zodResolver(VenuesSchema.create),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'courts',
  });

  async function handleCreate(data: CreateVenueData) {
    startTransition(async () => {
      const { success, message } = await createVenue(data);

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
        <PlusCircleIcon /> Tambah Lapangan
      </Button>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90dvh] overflow-hidden max-w-[calc(100%-24px)] md:max-w-2xl lg:max-w-3xl max-sm:px-3"
      >
        <DialogHeader className="shrink-0 px-3">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-bold">
              Tambah Tempat & Lapangan
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
            Data ini akan disimpan dan dapat dipilih langsung kapan pun Anda
            menjadwalkan pertandingan.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleCreate)}
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
                      required
                      render={({ field, fieldState }) => (
                        <RadioGroup
                          defaultValue={field.value}
                          data-invalid={fieldState.invalid}
                          className="flex items-center gap-3 max-md:flex-wrap"
                        >
                          {sports.map((s) => (
                            <FieldLabel
                              key={s.id}
                              htmlFor={s.id}
                              className="cursor-pointer"
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
