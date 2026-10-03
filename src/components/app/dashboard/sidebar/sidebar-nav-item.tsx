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
import { cn } from '@/lib/utils';
import { NavigationItemType } from '@/types/navigation';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SidebarNavItem({
  navItem,
}: {
  navItem: NavigationItemType;
}) {
  const pathname = usePathname();
  const { isMobile, state, setOpenMobile } = useSidebar();
  const [isCollapsed, setIsCollapsed] = useState(state === 'collapsed');

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

  function handleSidebarMobile() {
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  if (!hasSubItems) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          render={<Link href={navItem.href!} onClick={handleSidebarMobile} />}
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
              render={
                <Link href={subItem.href} onClick={handleSidebarMobile} />
              }
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
                render={
                  <Link href={subItem.href} onClick={handleSidebarMobile} />
                }
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
