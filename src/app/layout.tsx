import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import '@/shared/components/editor/style.css';
import { cn } from '@/shared/lib/utils';
import { Toaster } from '@/shared/components/ui/sonner';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { ThemeProvider } from '@/shared/components/providers/theme-provider';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Societe Sportive',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn('min-h-svh max-h-svh', 'antialiased', inter.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-svh max-h-svh w-svw flex flex-col overflow-hidden">
        <NextTopLoader showSpinner={false} height={2} shadow={false} />
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
