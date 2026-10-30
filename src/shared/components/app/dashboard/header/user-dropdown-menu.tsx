'use client';

import signOut from '@/modules/auth/actions/sign-out';
import { User } from '@/modules/auth/types';
import { ImageWithSkeleton } from '@/shared/components/app/image-with-skeleton';
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
import { getInitials } from '@/shared/lib/string';
import { LogOutIcon, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function UserDropdownMenu({
  userPromise,
}: {
  userPromise: Promise<User | null>;
}) {
  const user = use(userPromise);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <Avatar>
              <AvatarImage
                render={
                  <ImageWithSkeleton
                    src={
                      user?.image ??
                      `https://api.dicebear.com/10.x/notionists/svg?seed=${user?.id ?? 'user'}`
                    }
                    alt={user?.name ?? 'Avatar'}
                    fill
                  />
                }
              />
              <AvatarFallback>{getInitials(user?.name ?? '?')}</AvatarFallback>
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
  );
}
