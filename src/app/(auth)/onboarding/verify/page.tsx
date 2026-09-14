'use client';

import { useUser } from '@/components/providers/user-provider';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import resendOtp from '@/features/auth/actions/onboarding/resend-otp';
import signOut from '@/features/auth/actions/sign-out';
import verifyPhoneNumber from '@/features/auth/actions/onboarding/verify-phone-number';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatPhoneNumberIntl } from 'react-phone-number-input';
import { toast } from 'sonner';
import Link from 'next/link';

const RESEND_COOLDOWN = Number(process.env.NEXT_PUBLIC_RESEND_COOLDOWN!);
const RESEND_KEY = process.env.NEXT_PUBLIC_RESEND_KEY!;

export default function OnboardingVerifyPage() {
  const { user } = useUser();
  const [timeLeft, setTimeLeft] = useState(0);
  const [otp, setOtp] = useState('');
  const router = useRouter();

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
    const res = await resendOtp(user?.phoneNumber as string);

    if (!res.success) return toast.error(res.message);

    const expiresAt = Date.now() + RESEND_COOLDOWN * 1000;
    localStorage.setItem(RESEND_KEY, expiresAt.toString());
    toast.message(res.message);
    setTimeLeft(RESEND_COOLDOWN);
  }

  async function handleVerify() {
    const res = await verifyPhoneNumber({
      phoneNumber: user!.phoneNumber!,
      code: otp,
    });

    if (!res.success) toast.error('Gagal memverifikasi nomer ponsel.');

    router.push('/');
    router.refresh();
  }

  async function handleSignOut() {
    const res = await signOut();

    if (!res.success) return toast.error(res.message);

    router.push('/sign-in');
  }

  return (
    <FieldGroup>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">Verifikasi Nomor Ponsel</h1>
        <p className="text-sm text-balance text-muted-foreground">
          Kode verifikasi telah dikirim ke WhatsApp{' '}
          <span className="font-bold">
            {formatPhoneNumberIntl(user?.phoneNumber as string)}
          </span>
          .
        </p>
        <p className="text-sm text-balance text-muted-foreground">
          Masukkan 6 digit kode di bawah ini untuk melanjutkan.
        </p>
      </div>
      <Field className="mx-auto">
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          disabled={!timeLeft}
          value={otp}
          onChange={(value) => setOtp(value)}
        >
          <InputOTPGroup className="*:data-[slot=input-otp-slot]:size-10 sm:*:data-[slot=input-otp-slot]:size-12 *:data-[slot=input-otp-slot]:shrink md:*:data-[slot=input-otp-slot]:h-15 md:*:data-[slot=input-otp-slot]:w-18 md:*:data-[slot=input-otp-slot]:last:rounded-e-full md:*:data-[slot=input-otp-slot]:first:rounded-s-full *:data-[slot=input-otp-slot]:text-lg md:*:data-[slot=input-otp-slot]:text-xl mx-auto">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
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
      <Field>
        <Button type="button" className="cursor-pointer" onClick={handleVerify}>
          Verifikasi
        </Button>
        <FieldDescription className="text-center">
          Tidak bisa akses ke nomor ponsel?{' '}
          <Link
            href="/onboarding/change-phone-number"
            className="cursor-pointer underline underline-offset-4"
          >
            Ganti nomor ponsel
          </Link>
        </FieldDescription>
      </Field>
      <FieldSeparator>Atau</FieldSeparator>
      <Field>
        <Button
          type="button"
          variant="destructive"
          className="cursor-pointer"
          onClick={handleSignOut}
        >
          Keluar dari Akun
        </Button>
      </Field>
    </FieldGroup>
  );
}
