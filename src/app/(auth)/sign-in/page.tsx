'use client';

import InputField from '@/components/app/form/input-field';
import SecretInput from '@/components/app/form/secret-input';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import signIn from '@/features/auth/actions/sign-in';
import signInWithGoogle from '@/features/auth/actions/sign-in-with-google';
import { AuthSchema } from '@/features/auth/schema';
import { SignInData } from '@/features/auth/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircleIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<SignInData>({
    resolver: zodResolver(AuthSchema.signIn),
    defaultValues: {
      phoneNumber: '',
      password: '',
    },
  });

  async function handleSignIn(data: SignInData) {
    const res = await signIn(data);
    const callbackUrl = searchParams.get('callbackUrl');

    if (!res.success) return toast.error(res.message);

    router.push(callbackUrl ?? '/');
    router.refresh();
  }

  async function handleSignInWithGoogle() {
    const res = await signInWithGoogle();

    if (!res.success) return toast.error(res.message);

    window.location.assign(res.data!.url!);
    router.refresh();
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(handleSignIn)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Masuk ke Akun</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Isi formulir di bawah ini untuk masuk ke akun Anda.
          </p>
        </div>

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

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">
                  Kata Sandi <span className="text-destructive">*</span>
                </FieldLabel>
                <Link
                  href="/reset-password/request"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Lupa kata sandi akun?
                </Link>
              </div>

              <SecretInput {...field} aria-invalid={fieldState.invalid} />

              {fieldState.invalid && (
                <div className="flex items-center gap-2">
                  <AlertCircleIcon className="text-destructive" size={14} />
                  <FieldError errors={[fieldState.error]} />
                </div>
              )}
            </Field>
          )}
        />

        <Field>
          <Button type="submit" className="cursor-pointer">
            Masuk
          </Button>
        </Field>

        <FieldSeparator>Atau lanjutkan dengan</FieldSeparator>

        <Field>
          <Button
            variant="outline"
            type="button"
            onClick={handleSignInWithGoogle}
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
          <FieldDescription className="text-center">
            Belum punya akun?{' '}
            <Link href="/sign-up" className="underline underline-offset-4">
              Daftar
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
