'use client';

import InputField from '@/components/app/form/input-field';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import requestPasswordReset from '@/features/auth/actions/reset-password/request-password-reset';
import verifyPasswordReset from '@/features/auth/actions/reset-password/verify-password-reset';
import { AuthSchema } from '@/features/auth/schema';
import { VerifyPasswordResetData } from '@/features/auth/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { AlertCircleIcon, InfoIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { formatPhoneNumberIntl } from 'react-phone-number-input';
import { toast } from 'sonner';

const RESEND_COOLDOWN = Number(process.env.NEXT_PUBLIC_RESEND_COOLDOWN!);
const RESEND_KEY = process.env.NEXT_PUBLIC_RESEND_KEY!;

export default function VerifyPasswordResetPage({
  params,
}: {
  params: Promise<{ phoneNumber: string }>;
}) {
  const phoneNumber = decodeURIComponent(use(params).phoneNumber);
  const [timeLeft, setTimeLeft] = useState(0);
  const router = useRouter();

  const form = useForm<VerifyPasswordResetData>({
    resolver: zodResolver(AuthSchema.verifyPasswordReset),
    defaultValues: {
      phoneNumber: phoneNumber,
      otp: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    function updateTimer() {
      const expiresAt = Number(localStorage.getItem(RESEND_KEY));

      if (!expiresAt) {
        setTimeLeft(0);
        return;
      }

      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));

      setTimeLeft(remaining);

      if (remaining === 0) {
        localStorage.removeItem(RESEND_KEY);
      }
    }

    updateTimer();

    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, []);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  async function handleResend() {
    const res = await requestPasswordReset({ phoneNumber });

    if (!res.success) return toast.error(res.message);

    const expiresAt = Date.now() + RESEND_COOLDOWN * 1000;
    localStorage.setItem(RESEND_KEY, expiresAt.toString());
    setTimeLeft(RESEND_COOLDOWN);
  }

  async function handleVerifyPasswordReset(data: VerifyPasswordResetData) {
    const res = await verifyPasswordReset(data);

    if (!res.success) toast.error(res.message);

    toast.success(res.message);
    router.push('/sign-in');
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(handleVerifyPasswordReset)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Atur Ulang Kata Sandi</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Masukkan kode verifikasi yang telah dikirim ke nomor WhatsApp{' '}
            <span className="font-bold">
              {formatPhoneNumberIntl(phoneNumber)}
            </span>
            , lalu buat kata sandi baru untuk akun Anda.
          </p>
        </div>

        <Controller
          name="otp"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="mx-auto" data-invalid={fieldState.invalid}>
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                disabled={!timeLeft}
                {...field}
              >
                <InputOTPGroup className="rounded-full *:data-[slot=input-otp-slot]:size-10 sm:*:data-[slot=input-otp-slot]:size-12 *:data-[slot=input-otp-slot]:shrink md:*:data-[slot=input-otp-slot]:h-15 md:*:data-[slot=input-otp-slot]:w-18 md:*:data-[slot=input-otp-slot]:last:rounded-e-full md:*:data-[slot=input-otp-slot]:first:rounded-s-full *:data-[slot=input-otp-slot]:text-lg md:*:data-[slot=input-otp-slot]:text-xl mx-auto">
                  <InputOTPSlot index={0} aria-invalid={fieldState.invalid} />
                  <InputOTPSlot index={1} aria-invalid={fieldState.invalid} />
                  <InputOTPSlot index={2} aria-invalid={fieldState.invalid} />
                  <InputOTPSlot index={3} aria-invalid={fieldState.invalid} />
                  <InputOTPSlot index={4} aria-invalid={fieldState.invalid} />
                  <InputOTPSlot index={5} aria-invalid={fieldState.invalid} />
                </InputOTPGroup>
              </InputOTP>
              {fieldState.invalid && (
                <div className="flex items-center gap-2">
                  <AlertCircleIcon className="text-destructive" size={14} />
                  <FieldError errors={[fieldState.error]} />
                </div>
              )}
              <FieldDescription className="text-center">
                {timeLeft ? (
                  <>
                    Kode dapat dikirim ulang dalam{' '}
                    <span className="font-bold text-primary">
                      {formatTime(timeLeft)}
                    </span>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="link"
                    className="cursor-pointer underline underline-offset-4 text-muted-foreground hover:text-primary p-0"
                    onClick={handleResend}
                  >
                    Kirim kode verifikasi baru
                  </Button>
                )}
              </FieldDescription>
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <InputField
              field={field}
              fieldState={fieldState}
              label="Kata Sandi Baru"
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
              label="Konfirmasi Kata Sandi Baru"
              description="Pastikan kata sandi yang Anda masukkan cocok."
              required
              secret
            />
          )}
        />
        
        <Field>
          <Button type="submit" className="cursor-pointer">
            Verifikasi & Simpan
          </Button>
          <FieldDescription className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={() => router.back()}
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
