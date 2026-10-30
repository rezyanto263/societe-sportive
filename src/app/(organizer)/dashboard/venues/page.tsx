import { Card } from '@/shared/components/ui/card';
import { getSports } from '@/modules/sports/queries/get-sports';
import CreateVenueDialog from '@/modules/venues/components/create-dialog';
import { MapPinnedIcon } from 'lucide-react';
import RefreshButton from '@/shared/components/app/refresh-button';
import { Suspense } from 'react';
import VenueStats from '@/modules/venues/components/venue-stats';
import VenueStatsSkeleton from '@/modules/venues/components/venue-stats/skeleton';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { VenuesSchema } from '@/modules/venues/schema';
import { getVenues } from '@/modules/venues/queries/get-venues';
import VenueFiltersSkeleton from '@/modules/venues/components/venue-filters/skeleton';
import VenueFilters from '@/modules/venues/components/venue-filters';
import VenueListSkeleton from '@/modules/venues/components/venue-list/skeleton';
import VenueList from '@/modules/venues/components/venue-list';

type Props = {
  searchParams: Promise<{
    keyword?: string;
    page?: string;
    limit?: string;
    sport?: string;
  }>;
};

export const instant = false;

export default async function VenueListPage({ searchParams }: Props) {
  const { page, limit, ...params } = await searchParams;

  const search = VenuesSchema.searchParams.safeParse({
    page: Number(page ?? 1),
    limit: Number(limit ?? 10),
    ...params,
  });

  const filters = search.success
    ? search.data
    : VenuesSchema.searchParams.parse({});

  const queryString = new URLSearchParams({
    ...filters,
    page: String(filters.page),
    limit: String(filters.limit),
  }).toString();

  const venuesPromise = getVenues(filters);
  const sportsPromise = getSports();

  return (
    <div className="p-6 space-y-8">
      <Card className="p-6 flex-row justify-between max-lg:flex-col">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-green-700 font-bold uppercase">
            <MapPinnedIcon className="size-5" />
            DATA LOKASI PERTANDINGAN
          </div>
          <h1 className="inline-block text-3xl font-bold">Tempat & Lapangan</h1>
          <p className="text-muted-foreground">
            Kelola data tempat dan lapangan yang digunakan untuk pertandingan.
            Pilih tempat dan lapangan saat membuat game tanpa perlu mengisi
            ulang detail lokasi.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RefreshButton />

          <Suspense fallback={<Skeleton className="h-9 w-42" />}>
            <CreateVenueDialog sportsPromise={sportsPromise} />
          </Suspense>
        </div>
      </Card>

      <Suspense fallback={<VenueStatsSkeleton />}>
        <VenueStats />
      </Suspense>

      <Suspense fallback={<VenueFiltersSkeleton />}>
        <VenueFilters
          queryString={queryString}
          venuesPromise={venuesPromise}
          sportsPromise={sportsPromise}
        />
      </Suspense>

      <Suspense fallback={<VenueListSkeleton />}>
        <VenueList
          venuesPromise={venuesPromise}
          sportsPromise={sportsPromise}
        />
      </Suspense>
    </div>
  );
}
