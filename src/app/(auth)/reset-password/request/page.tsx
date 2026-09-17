'use client';

import { PhoneInput } from '@/components/app/form/phone-input';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import requestPasswordReset from '@/features/auth/actions/reset-password/request-password-reset';
import { AuthSchema } from '@/features/auth/schema';
import { RequestPasswordResetData } from '@/features/auth/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircleIcon, InfoIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const RESEND_COOLDOWN = Number(process.env.NEXT_PUBLIC_RESEND_COOLDOWN!);
const RESEND_KEY = process.env.NEXT_PUBLIC_RESEND_KEY!;

export default function RequestPasswordResetPage() {
  const router = useRouter();

  const form = useForm<RequestPasswordResetData>({
    resolver: zodResolver(AuthSchema.requestPasswordReset),
    defaultValues: { phoneNumber: '' },
  });

  async function handleRequestPasswordReset(data: RequestPasswordResetData) {
    const res = await requestPasswordReset(data);

    if (!res.success) toast.error(res.message);

    // eslint-disable-next-line react-hooks/purity
    const expiresAt = Date.now() + RESEND_COOLDOWN * 1000;
    localStorage.setItem(RESEND_KEY, expiresAt.toString());
    router.push(`/reset-password/${data.phoneNumber}`);
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(handleRequestPasswordReset)}
      noValidate
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Lupa Kata Sandi Akun?</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Masukkan nomor ponsel yang terdaftar di akun Anda. Kami akan
            mengirimkan kode verifikasi melalui WhatsApp untuk membantu Anda
            membuat kata sandi baru.
          </p>
        </div>
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
        <Field>
          <Button className="cursor-pointer" type="submit">
            Kirim Kode Verifikasi
          </Button>
          <FieldDescription className="text-center">
            <Link href="/sign-in" className="underline underline-offset-4">
              Kembali ke halaman masuk
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
