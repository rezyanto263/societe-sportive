import DashboardHeader from '@/shared/components/app/dashboard/header';
import DashboardSidebar from '@/shared/components/app/dashboard/sidebar';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { SidebarProvider } from '@/shared/components/ui/sidebar';
import { cookies } from 'next/headers';

export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <DashboardSidebar />
      <div className="flex flex-col w-full flex-1 min-h-0 overflow-hidden">
        <DashboardHeader />
        <ScrollArea className="flex-1 min-h-0">
          <main className="w-full max-w-340 mx-auto">{children}</main>
        </ScrollArea>
      </div>
    </SidebarProvider>
  );
}
