import { getCurrentUser } from '@/core/auth/session';
import UserDropdownMenu from '@/shared/components/app/dashboard/header/user-dropdown-menu';
import { ThemeToggle } from '@/shared/components/app/theme-toggle';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Suspense } from 'react';

export default function DashboardHeader() {
  const userPromise = getCurrentUser();

  return (
    <header className="flex items-center justify-between border-b p-3 bg-sidebar sticky top-0 shrink-0">
      <SidebarTrigger className="cursor-pointer" size="icon-lg" />

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <Suspense
          fallback={
            <Skeleton className="size-8 rounded-full border border-transparent" />
          }
        >
          <UserDropdownMenu userPromise={userPromise} />
        </Suspense>
      </div>
    </header>
  );
}
