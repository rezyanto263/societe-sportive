'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { dashboardNavigation } from '@/config/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SidebarNavItem({
  navItem,
}: {
  navItem: (typeof dashboardNavigation)[number]['items'][number];
}) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const [isCollapsed, setIsCollapsed] = useState(state === 'collapsed');
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCollapsed(state === 'collapsed');
    }, 150);

    return () => clearTimeout(timer);
  }, [state]);

  const hasSubItems = Boolean(navItem.items?.length);
  const isSubItemActive =
    navItem.items?.some((subItem) => pathname === subItem.href) ?? false;
  const [open, setOpen] = useState(isSubItemActive);

  if (!hasSubItems) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          render={<Link href={navItem.href!} />}
          isActive={pathname === navItem.href}
          tooltip={navItem.title}
        >
          <navItem.icon />
          <span>{navItem.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  if (isCollapsed && hasSubItems && !isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          className="cursor-pointer"
          render={
            <SidebarMenuButton
              isActive={isSubItemActive}
              tooltip={navItem.title}
            >
              <navItem.icon />
              <span>{navItem.title}</span>
            </SidebarMenuButton>
          }
        />

        <DropdownMenuContent side="right" align="start">
          {navItem.items!.map((subItem) => (
            <DropdownMenuItem
              className={cn(
                'cursor-pointer',
                pathname === subItem.href &&
                  'bg-accent! text-accent-foreground!',
              )}
              key={subItem.href}
              render={<Link href={subItem.href} />}
            >
              {subItem.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      render={<SidebarMenuItem />}
    >
      <CollapsibleTrigger
        className="group/collapsible cursor-pointer"
        render={
          <SidebarMenuButton isActive={isSubItemActive} tooltip={navItem.title}>
            <navItem.icon />
            <span>{navItem.title}</span>

            <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-panel-open/collapsible:rotate-90" />
          </SidebarMenuButton>
        }
      />

      <CollapsibleContent>
        <SidebarMenuSub>
          {navItem.items!.map((subItem) => (
            <SidebarMenuSubItem key={subItem.href}>
              <SidebarMenuSubButton
                render={<Link href={subItem.href} />}
                isActive={pathname === subItem.href}
              >
                <span>{subItem.title}</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}
