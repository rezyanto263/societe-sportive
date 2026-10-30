'use client';

import { Metadata } from '@/core/types/query';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';
import { createPageUrl } from '@/shared/lib/url';
import { usePathname, useSearchParams } from 'next/navigation';

type Props = {
  metadata: Metadata;
};

export default function VenuePagination({ metadata }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <Pagination className="lg:col-span-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageUrl({
              pathname,
              searchParams,
              value: metadata.page - 1,
            })}
            text="Sebelumnya"
            size="sm"
            aria-disabled={!metadata.hasPreviousPage}
            className={
              !metadata.hasPreviousPage
                ? 'pointer-events-none opacity-50'
                : undefined
            }
          />
        </PaginationItem>

        {Array.from(
          { length: metadata.totalPages },
          (_, index) => index + 1,
        ).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              size="sm"
              href={createPageUrl({
                pathname,
                searchParams,
                value: page,
              })}
              isActive={page === metadata.page}
              aria-label={`Halaman ${page}`}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={createPageUrl({
              pathname,
              searchParams,
              value: metadata.page + 1,
            })}
            text="Selanjutnya"
            size="sm"
            aria-disabled={!metadata.hasNextPage}
            className={
              !metadata.hasNextPage
                ? 'pointer-events-none opacity-50'
                : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
