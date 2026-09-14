import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { UserProvider } from '@/components/providers/user-provider';
import getUser from '@/features/auth/actions/get-user';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Societe Sportive',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html
      lang="en"
      className={cn(
        'h-full',
        'antialiased',
        'font-sans',
        inter.variable,
        'dark',
      )}
    >
      <body className="min-h-full flex flex-col">
        <Toaster />
        <UserProvider user={user}>{children}</UserProvider>
      </body>
    </html>
  );
}
