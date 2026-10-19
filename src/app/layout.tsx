import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@/shared/components/editor/style.css';
import { cn } from '@/shared/lib/utils';
import { Toaster } from '@/shared/components/ui/sonner';
import { UserProvider } from '@/shared/components/providers/user-provider';
import { getCurrentUser } from '@/modules/auth/queries/get-current-user';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { ThemeProvider } from '@/shared/components/providers/theme-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Societe Sportive',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html
      lang="id"
      className={cn('min-h-svh max-h-svh', 'antialiased', inter.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-svh max-h-svh flex flex-col overflow-hidden">
        <UserProvider user={user}>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              {children}
            </TooltipProvider>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
