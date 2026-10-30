'use client';

import SidebarNavItem from '@/shared/components/app/dashboard/sidebar/sidebar-nav-item';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/shared/components/ui/sidebar';
import { dashboardNavigation } from '@/core/config/navigation';

export default function SidebarNavGroup() {
  return (
    <>
      {dashboardNavigation.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

          <SidebarMenu>
            {group.items.map((item) => (
              <SidebarNavItem key={item.href ?? item.title} navItem={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
