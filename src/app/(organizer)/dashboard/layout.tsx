import DashboardHeader from '@/components/app/dashboard/header';
import DashboardSidebar from '@/components/app/dashboard/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get('sidebar_state');

  const defaultOpen = sidebarState?.value !== 'false';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <DashboardSidebar />
      <main className="flex flex-col w-full flex-1 min-h-0 overflow-hidden">
        <DashboardHeader />
        <ScrollArea className="flex-1 min-h-0">{children}</ScrollArea>
      </main>
    </SidebarProvider>
  );
}
