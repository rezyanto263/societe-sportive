'use client';

import { GENDER, ROLE } from '@/modules/auth/constants';
import { Role } from '@/modules/auth/types';
import { createMember } from '@/modules/members/actions/create-member';
import { MembersSchema } from '@/modules/members/schema';
import { CreateMemberData } from '@/modules/members/types';
import InputField from '@/shared/components/app/form/input-field';
import RoleIcon from '@/shared/components/app/icon/role';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Spinner } from '@/shared/components/ui/spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircleIcon, XIcon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function CreateMemberDialog() {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, startTransition] = useTransition();

  const defaultValues: CreateMemberData = {
    name: '',
    gender: GENDER.MALE,
    role: ROLE.PLAYER,
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  };

  const form = useForm<CreateMemberData>({
    resolver: zodResolver(MembersSchema.create),
    defaultValues,
  });

  function handleCreate(data: CreateMemberData) {
    startTransition(async () => {
      const { success, message } = await createMember(data);

      if (!success) {
        toast.error(message);
        return;
      }

      setOpen(false);
      form.reset(defaultValues);
      toast.success(message);
    });
  }

  const roleItems = Object.values(ROLE).map((role) => ({
    label: (
      <>
        <RoleIcon roleName={role} /> {role}
      </>
    ),
    value: role,
  }));

  return (
    <Dialog open={open}>
      <Button
        type="button"
        className="cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <PlusCircleIcon /> Tambah Anggota
      </Button>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90dvh] overflow-hidden max-w-[calc(100%-24px)] md:max-w-2xl lg:max-w-4xl max-sm:px-3"
      >
        <DialogHeader className="shrink-0 px-3">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-bold">
              Tambah Anggota Komunitas
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
            Daftarkan anggota baru ke dalam komunitas.
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
                      label="Nama Lengkap"
                      required
                    />
                  )}
                />
              </div>

              <div className="col-span-12">
                <Controller
                  name="gender"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <InputField
                      field={field}
                      fieldState={fieldState}
                      label="Jenis Kelamin"
                      type="gender"
                      required
                    />
                  )}
                />
              </div>

              <div className="col-span-12 lg:col-span-6">
                <Controller
                  name="phoneNumber"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <InputField
                      field={field}
                      fieldState={fieldState}
                      label="Nomor Ponsel"
                      description="Nomor ponsel harus valid dan dapat dihubungi."
                      type="tel"
                      required
                    />
                  )}
                />
              </div>

              <div className="col-span-12 lg:col-span-6">
                <Controller
                  name="role"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <InputField
                      field={field}
                      fieldState={fieldState}
                      label="Hak Akses"
                      required
                      render={({ field, fieldState }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          aria-invalid={fieldState.invalid}
                          items={roleItems}
                        >
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue className="capitalize" />
                          </SelectTrigger>
                          <SelectContent alignItemWithTrigger={false}>
                            <SelectGroup>
                              {roleItems.map((item, index) => (
                                <SelectItem
                                  key={index}
                                  value={item.value}
                                  className="capitalize cursor-pointer"
                                >
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  )}
                />
              </div>

              <div className="col-span-12 lg:col-span-6">
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <InputField
                      field={field}
                      fieldState={fieldState}
                      label="Kata Sandi"
                      required
                      secret
                    />
                  )}
                />
              </div>

              <div className="col-span-12 lg:col-span-6">
                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <InputField
                      field={field}
                      fieldState={fieldState}
                      label="Konfirmasi Kata Sandi"
                      description="Pastikan kata sandi yang Anda masukkan cocok."
                      required
                      secret
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
