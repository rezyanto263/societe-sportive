'use client';

import SidebarNavItem from '@/components/app/dashboard/sidebar/sidebar-nav-item';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { dashboardNavigation } from '@/config/navigation';
import { Permission } from '@/types/permission';
import { filterDashboardNavigation } from '@/lib/utils';

export default function SidebarNavGroup({
  userPermissions,
}: {
  userPermissions?: Permission;
}) {
  const navigation = userPermissions
    ? filterDashboardNavigation(dashboardNavigation, userPermissions)
    : [];

  return (
    <>
      {navigation.map((group) => (
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
