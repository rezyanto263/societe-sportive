'use client';

import { PhoneInput } from '@/components/app/phone-input';
import { useUser } from '@/components/providers/user-provider';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import saveProfile from '@/features/auth/actions/onboarding/save-profile';
import { AuthSchema } from '@/features/auth/schema';
import { OnboardingProfileData } from '@/features/auth/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircleIcon, InfoIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const RESEND_COOLDOWN = Number(process.env.NEXT_PUBLIC_RESEND_COOLDOWN!);
const RESEND_KEY = process.env.NEXT_PUBLIC_RESEND_KEY!;

export default function OnboardingProfilePage() {
  const { user } = useUser();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(AuthSchema.onboardingProfile),
    defaultValues: {
      name: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [form, user]);

  async function handleSaveProfile(data: OnboardingProfileData) {
    const res = await saveProfile(data);

    if (!res.success) return toast.error(res.message);

    // eslint-disable-next-line react-hooks/purity
    const expiresAt = Date.now() + RESEND_COOLDOWN * 1000;
    localStorage.setItem(RESEND_KEY, expiresAt.toString());
    router.push('/onboarding/verify');
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(handleSaveProfile)}
      noValidate
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Lengkapi Profil Akun</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Silahkan lengkapi profil akun Anda dengan mengisi informasi yang
            diperlukan di bawah ini.
          </p>
        </div>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">
                Nama Lengkap <span className="text-destructive">*</span>
              </FieldLabel>
              <Input {...field} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && (
                <div className="flex items-center gap-2">
                  <AlertCircleIcon className="text-destructive" size={14} />
                  <FieldError errors={[fieldState.error]} />
                </div>
              )}
            </Field>
          )}
        />
        <Controller
          name="phoneNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="phoneNumber">
                Nomor Ponsel <span className="text-destructive">*</span>
              </FieldLabel>
              <PhoneInput
                {...field}
                aria-invalid={fieldState.invalid}
                defaultCountry="ID"
              />
              {fieldState.invalid && (
                <div className="flex items-center gap-2">
                  <AlertCircleIcon className="text-destructive" size={14} />
                  <FieldError errors={[fieldState.error]} />
                </div>
              )}
              <div className="flex items-center gap-2">
                <InfoIcon
                  className="text-muted-foreground shrink-0"
                  size={14}
                />
                <FieldDescription>
                  Nomor ponsel harus valid dan dapat dihubungi.
                </FieldDescription>
              </div>
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">
                Kata Sandi <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                type="password"
              />
              {fieldState.invalid && (
                <div className="flex items-center gap-2">
                  <AlertCircleIcon className="text-destructive" size={14} />
                  <FieldError errors={[fieldState.error]} />
                </div>
              )}
            </Field>
          )}
        />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirm-password">
                Konfirmasi Kata Sandi <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                type="password"
              />
              {fieldState.invalid && (
                <div className="flex items-center gap-2">
                  <AlertCircleIcon className="text-destructive" size={14} />
                  <FieldError errors={[fieldState.error]} />
                </div>
              )}
              <div className="flex items-center gap-2">
                <InfoIcon
                  className="text-muted-foreground shrink-0"
                  size={14}
                />
                <FieldDescription>
                  Pastikan kata sandi yang Anda masukkan cocok.
                </FieldDescription>
              </div>
            </Field>
          )}
        />
        <Field>
          <Button type="submit" className="cursor-pointer">
            Simpan & Lanjut
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
