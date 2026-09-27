'use client';

import SidebarNavItem from '@/components/app/dashboard/sidebar/sidebar-nav-item';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboardNavigation } from '@/config/navigation';
import Image from 'next/image';

export default function DashboardSidebar() {
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
        {dashboardNavigation.map((navGroup) => (
          <SidebarGroup key={navGroup.title}>
            <SidebarGroupLabel>{navGroup.title}</SidebarGroupLabel>

            <SidebarMenu>
              {navGroup.items.map((navItem) => (
                <SidebarNavItem
                  key={navItem.href ?? navItem.title}
                  navItem={navItem}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
