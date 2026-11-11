'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

type Props = Omit<ComponentProps<typeof Button>, 'onClick'> & {
  value: string;
  text?: string;
  successText?: string;
  showTooltip?: boolean;
};

export default function CopyButton({
  value,
  text,
  successText,
  showTooltip = true,
  ...props
}: Props) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);
      toast.success('Berhasil disalin.');

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error('Gagal menyalin.');
    }
  };

  const button = (
    <Button {...props} onClick={handleCopy} disabled={props.disabled || !value}>
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied && text ? (successText ?? text) : text}
    </Button>
  );

  if (!showTooltip) return button;

  return (
    <Tooltip>
      <TooltipTrigger closeOnClick={false} render={button} />
      <TooltipContent>{copied ? 'Tersalin!' : 'Salin'}</TooltipContent>
    </Tooltip>
  );
}
