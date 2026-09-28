import SidebarNavGroup from '@/components/app/dashboard/sidebar/sidebar-nav-group';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import getUser from '@/features/auth/actions/get-user';
import { organizer, player } from '@/lib/permission';
import Image from 'next/image';

export default async function DashboardSidebar() {
  const user = await getUser();
  const userPermissions =
    user?.role === 'player'
      ? player.statements
      : user?.role === 'organizer'
        ? organizer.statements
        : undefined;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b py-4">
        <SidebarMenu>
          <SidebarMenuItem className="flex-nowrap overflow-hidden">
            <SidebarMenuButton
              className="pointer-events-none h-8! select-none gap-3 rounded-none! group-data-[collapsible=icon]:p-0!"
              render={
                <div>
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={35}
                    height={35}
                    className="size-8 shrink-0 rounded"
                  />

                  <div className="leading-3.5">
                    <h1 className="whitespace-nowrap font-extrabold">
                      SOCIÉTÉ SPORTIVE
                    </h1>

                    <span className="text-xs text-muted-foreground">
                      Dasbor Komunitas
                    </span>
                  </div>
                </div>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarNavGroup userPermissions={userPermissions} />
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
