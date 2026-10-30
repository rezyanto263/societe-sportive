'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { authClient } from '@/core/auth/client';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/ui/spinner';

export default function HomePage() {
  const { data: session, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    setIsSigningOut(true);

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || 'Gagal keluar dari akun.');
        },
      },
    });

    setIsSigningOut(false);
  }

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className='flex items-center gap-2'>
          <Spinner />
          <p>Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 font-sans">
      <h1 className="text-xl font-bold">Halaman Utama</h1>

      {session ? (
        <>
          <ul className="space-y-1">
            <li>Nama: {session.user.name}</li>
            <li>Gender: {session.user.gender}</li>
            <li>Email: {session.user.email}</li>
            <li>
              Email terverifikasi: {session.user.emailVerified ? 'Ya' : 'Tidak'}
            </li>
            <li>Nomor ponsel: {session.user.phoneNumber ?? '-'}</li>
            <li>
              Nomor ponsel terverifikasi:{' '}
              {session.user.phoneNumberVerified ? 'Ya' : 'Tidak'}
            </li>
            <li>Role: {session.user.role}</li>
          </ul>

          <Button
            variant="destructive"
            type="button"
            className="cursor-pointer"
            disabled={isSigningOut}
            onClick={handleSignOut}
          >
            {isSigningOut ? 'Keluar...' : 'Keluar dari Akun'}
          </Button>
        </>
      ) : (
        <Link href="/sign-in">
          <Button className="cursor-pointer">Masuk</Button>
        </Link>
      )}
    </div>
  );
}
