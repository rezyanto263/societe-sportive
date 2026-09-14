'use client';

import { useUser } from '@/components/providers/user-provider';
import { Button } from '@/components/ui/button';
import signOut from '@/features/auth/actions/sign-out';
import Link from 'next/link';

export default function HomePage() {
  const { user } = useUser();

  async function handleSignOut() {
    await signOut();
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Halaman Utama</h1>
      {!!user && (
        <ul>
          <li>Name: {user?.name}</li>
          <li>Email: {user?.email}</li>
          <li>Email Verified: {user?.emailVerified ? 'Yes' : 'No'}</li>
          <li>Phone Number: {user?.phoneNumber}</li>
          <li>
            Phone Number Verified: {user?.phoneNumberVerified ? 'Yes' : 'No'}
          </li>
        </ul>
      )}
      {!!user ? (
        <Button
          variant="destructive"
          type="button"
          className="cursor-pointer"
          onClick={handleSignOut}
        >
          Keluar dari Akun
        </Button>
      ) : (
        <Link href="/sign-in">
          <Button className="cursor-pointer">Masuk</Button>
        </Link>
      )}
    </div>
  );
}
