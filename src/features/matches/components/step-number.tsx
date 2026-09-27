import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';

export default function StepNumber({
  label,
  number,
  isActive,
  done,
}: {
  isActive: boolean;
  label: string;
  number: number;
  done: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span
        className={cn(
          'rounded-full flex items-center justify-center text-lg font-bold size-12',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground',
          done && 'outline-1 outline-secondary-foreground text-secondary-foreground bg-secondary',
        )}
      >
        {done ? <CheckIcon className="size-4.5 stroke-3" /> : number}
      </span>
      <span
        className={cn(
          'hidden lg:block',
          isActive ? 'text-primary' : 'text-muted-foreground',
          done && 'text-secondary-foreground'
        )}
      >
        {label}
      </span>
    </div>
  );
}
