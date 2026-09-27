'use client';

import InputField from '@/components/app/form/input-field';
import { useUser } from '@/components/providers/user-provider';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldGroup,
} from '@/components/ui/field';
import saveProfile from '@/features/auth/actions/onboarding/save-profile';
import { AuthSchema } from '@/features/auth/schema';
import { OnboardingProfileData } from '@/features/auth/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const RESEND_COOLDOWN = Number(process.env.NEXT_PUBLIC_RESEND_COOLDOWN!);
const RESEND_KEY = process.env.NEXT_PUBLIC_RESEND_KEY!;

export default function OnboardingProfilePage() {
  const { user } = useUser();
  const router = useRouter();

  const form = useForm<OnboardingProfileData>({
    resolver: zodResolver(AuthSchema.onboardingProfile),
    defaultValues: {
      name: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      gender: 'male',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        gender: 'male',
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
            <InputField
              field={field}
              fieldState={fieldState}
              label="Nama Lengkap"
              required
            />
          )}
        />

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
        <Field>
          <Button type="submit" className="cursor-pointer">
            Simpan & Lanjut
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
