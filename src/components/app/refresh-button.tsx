'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RefreshCwIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="secondary"
            size="icon"
            className="cursor-pointer"
            onClick={handleRefresh}
            disabled={isPending}
          >
            <RefreshCwIcon className={isPending ? 'animate-spin' : ''} />
          </Button>
        }
      />
      <TooltipContent>
        Refresh
      </TooltipContent>
    </Tooltip>
  );
}
