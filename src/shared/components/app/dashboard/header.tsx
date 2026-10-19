'use client';

import { ThemeToggle } from '@/shared/components/app/theme-toggle';
import { useUser } from '@/shared/components/providers/user-provider';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';
import signOut from '@/modules/auth/actions/sign-out';
import { getInitials } from '@/shared/lib/string';
import { LogOutIcon, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardHeader() {
  const { user } = useUser();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b p-3 bg-sidebar sticky top-0 shrink-0">
      <SidebarTrigger className="cursor-pointer" size="icon-lg" />

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <Avatar>
                  <AvatarImage
                    src={
                      user?.image ??
                      `https://api.dicebear.com/10.x/notionists/svg?seed=${user?.id ?? 'user'}`
                    }
                    alt={user?.name ?? 'user'}
                  />
                  <AvatarFallback>
                    {getInitials(user?.name ?? 'User')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <UserIcon />
                Profil Akun
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onClick={handleSignOut}
                className="cursor-pointer"
              >
                <LogOutIcon />
                Keluar Akun
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
