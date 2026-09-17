'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import { PhoneInput } from '@/components/app/form/phone-input';
import { Controller, useForm } from 'react-hook-form';
import { SignUpData } from '@/features/auth/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthSchema } from '@/features/auth/schema';
import { AlertCircleIcon, InfoIcon } from 'lucide-react';
import signInWithGoogle from '@/features/auth/actions/sign-in-with-google';
import { toast } from 'sonner';
import signUp from '@/features/auth/actions/sign-up';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();

  const form = useForm<SignUpData>({
    resolver: zodResolver(AuthSchema.signUp),
    defaultValues: {
      name: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function handleSignUp(data: SignUpData) {
    const res = await signUp(data);

    if (!res.success) return toast.error(res.message);

    router.push('/onboarding/verify');
  }

  async function handleSignUpWithGoogle() {
    const res = await signInWithGoogle();

    if (!res.success) return toast.error(res.message);

    window.location.assign(res.data!.url!);
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(handleSignUp)}
      noValidate
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Buat akun baru</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Isi formulir di bawah ini untuk membuat akun Anda
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
                Konfirmasi Kata Sandi{' '}
                <span className="text-destructive">*</span>
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
            Buat Akun
          </Button>
        </Field>
        <FieldSeparator>Atau lanjutkan dengan</FieldSeparator>
        <Field>
          <Button
            variant="outline"
            type="button"
            onClick={handleSignUpWithGoogle}
            className="cursor-pointer"
          >
            <Image
              src="/images/google.svg"
              alt="Google"
              width={20}
              height={20}
            />
            Lanjut dengan Google
          </Button>
          <FieldDescription className="px-6 text-center">
            Sudah memiliki akun? <Link href="/sign-in">Masuk</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
