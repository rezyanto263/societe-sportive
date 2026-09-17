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
import changePhoneNumber from '@/features/auth/actions/onboarding/change-phone-number';
import requestPasswordReset from '@/features/auth/actions/reset-password/request-password-reset';
import { AuthSchema } from '@/features/auth/schema';
import { OnboardingChangePhoneNumberData } from '@/features/auth/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircleIcon, InfoIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const RESEND_COOLDOWN = Number(process.env.NEXT_PUBLIC_RESEND_COOLDOWN!);
const RESEND_KEY = process.env.NEXT_PUBLIC_RESEND_KEY!;

export default function OnboardingChangePhoneNumberPage() {
  const router = useRouter();

  const form = useForm<OnboardingChangePhoneNumberData>({
    resolver: zodResolver(AuthSchema.onboardingChangePhoneNumber),
    defaultValues: { phoneNumber: '' },
  });

  async function handleChangePhoneNumber(
    data: OnboardingChangePhoneNumberData,
  ) {
    const res = await changePhoneNumber(data);

    if (!res.success) return toast.error(res.message);

    // eslint-disable-next-line react-hooks/purity
    const expiresAt = Date.now() + RESEND_COOLDOWN * 1000;
    localStorage.setItem(RESEND_KEY, expiresAt.toString());
    toast.success(res.message);
    router.push(`/onboarding/verify`);
    router.refresh();
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(handleChangePhoneNumber)}
      noValidate
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Ganti Nomor Ponsel Akun</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Perbarui nomor ponsel yang terhubung dengan akunmu. Kami akan
            mengirimkan kode verifikasi ke nomor ponsel baru untuk memastikan
            nomor tersebut milikmu.
          </p>
        </div>
        <Controller
          name="phoneNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="phoneNumber">
                Nomor Ponsel Baru<span className="text-destructive">*</span>
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
            Simpan & Lanjutkan
          </Button>
          <FieldDescription className="text-center">
            <Button
              onClick={() => router.back()}
              variant="link"
              className="cursor-pointer underline underline-offset-4 text-muted-foreground hover:text-primary p-0"
            >
              Kembali ke halaman sebelumnya
            </Button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
