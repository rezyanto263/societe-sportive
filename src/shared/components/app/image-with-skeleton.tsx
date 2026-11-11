'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type ComponentProps } from 'react';

import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';

type Props = ComponentProps<typeof Image> & {
  containerClassName?: string;
  skeletonClassName?: string;
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
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const image = imageRef.current;

    if (image?.complete) {
      setIsLoading(false);
    }
  }, []);

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
        ref={imageRef}
        alt={alt}
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
