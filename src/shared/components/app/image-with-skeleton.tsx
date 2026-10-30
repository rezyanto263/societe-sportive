'use client';

import Image from 'next/image';
import { useState, type ComponentProps } from 'react';

import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';

type Props = ComponentProps<typeof Image> & {
  /** Class untuk wrapper (div pembungkus) */
  containerClassName?: string;
  /** Class untuk skeleton loading */
  skeletonClassName?: string;
  /** Matikan skeleton jika tidak diperlukan */
  withSkeleton?: boolean;
};

export function ImageWithSkeleton({
  alt,
  className,
  containerClassName,
  skeletonClassName,
  withSkeleton = true,
  onLoad,
  onError,
  ...props
}: Props) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={cn('relative size-full overflow-hidden', containerClassName)}
    >
      {withSkeleton && isLoading && (
        <Skeleton
          className={cn(
            'absolute inset-0 z-10 size-full rounded-none',
            skeletonClassName,
          )}
        />
      )}

      <Image
        {...props}
        alt={alt}
        ref={(img) => {
          if (img?.complete) setIsLoading(false);
        }}
        className={cn(
          'transition-opacity duration-300',
          withSkeleton && isLoading ? 'opacity-0' : 'opacity-100',
          className,
        )}
        onLoad={(event) => {
          onLoad?.(event);
          setIsLoading(false);
        }}
        onError={(event) => {
          onError?.(event);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
