'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field';
import Link from 'next/link';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import { SignUpData } from '@/features/auth/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthSchema } from '@/features/auth/schema';
import signInWithGoogle from '@/features/auth/actions/sign-in-with-google';
import { toast } from 'sonner';
import signUp from '@/features/auth/actions/sign-up';
import { useRouter } from 'next/navigation';
import InputField from '@/components/app/form/input-field';

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
            Isi formulir di bawah ini untuk membuat akun Anda.
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
