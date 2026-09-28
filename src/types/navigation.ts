import { Permission } from '@/types/permission';
import { LucideIcon } from 'lucide-react';

export type NavigationType = NavigationGroupType[];

export type NavigationGroupType = {
  title: string;
  items: NavigationItemType[];
};

export type NavigationItemType = {
  title: string;
  href?: string;
  icon: LucideIcon;
  permission?: Permission;
  items?: NavigationSubItemType[];
};

export type NavigationSubItemType = {
  title: string;
  href: string;
  permission: Permission;
};
