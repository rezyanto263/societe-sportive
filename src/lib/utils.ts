import { Permission } from '@/types/permission';
import {
  NavigationItemType,
  NavigationSubItemType,
  NavigationType,
} from '@/types/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function hasPermission(
  requiredPermission: Permission | undefined,
  userPermissions: Permission,
): boolean {
  if (!requiredPermission) return true;

  return Object.entries(requiredPermission).every(([resource, actions]) => {
    const userActions = userPermissions[resource as keyof Permission] as
      | readonly string[]
      | undefined;

    if (!userActions) return false;

    return (actions as readonly string[]).every((action) =>
      userActions.includes(action),
    );
  });
}

function filterSubItems(
  items: NavigationSubItemType[],
  userPermissions: Permission,
): NavigationSubItemType[] {
  return items.filter((item) =>
    hasPermission(item.permission, userPermissions),
  );
}

function filterNavigationItems(
  items: NavigationItemType[],
  userPermissions: Permission,
): NavigationItemType[] {
  return items
    .map((item) => {
      // Item biasa
      if (!item.items) {
        return hasPermission(item.permission, userPermissions) ? item : null;
      }

      // Filter submenu
      const filteredSubItems = filterSubItems(item.items, userPermissions);

      // Tidak ada submenu yang boleh diakses
      if (filteredSubItems.length === 0) {
        return null;
      }

      // Jika hanya ada satu submenu,
      // naikkan submenu menjadi item biasa
      if (filteredSubItems.length === 1) {
        const [subItem] = filteredSubItems;

        return {
          title: subItem.title,
          href: subItem.href,
          icon: item.icon,
          permission: subItem.permission,
        };
      }

      // Jika ada lebih dari satu submenu,
      // tetap gunakan parent sebagai dropdown
      if (!hasPermission(item.permission, userPermissions)) {
        return null;
      }

      return {
        ...item,
        items: filteredSubItems,
      };
    })
    .filter((item): item is NavigationItemType => item !== null);
}

export function filterDashboardNavigation(
  navigation: NavigationType,
  userPermissions: Permission,
): NavigationType {
  return navigation
    .map((group) => {
      const items = filterNavigationItems(group.items, userPermissions);

      return {
        ...group,
        items,
      };
    })
    .filter((group) => group.items.length > 0);
}
