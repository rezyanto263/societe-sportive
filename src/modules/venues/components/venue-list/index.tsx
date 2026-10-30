'use client';

import CourtIcon from '@/shared/components/app/icon/court';
import SportIcon from '@/shared/components/app/icon/sports';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/components/ui/empty';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from '@/shared/components/ui/item';
import { Separator } from '@/shared/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { Sport } from '@/modules/sports/types';
import DeleteVenueDialog from '@/modules/venues/components/delete-dialog';
import UpdateVenueDialog from '@/modules/venues/components/update-dialog';
import { Sports, Venues } from '@/core/database/types';
import {
  BanknoteIcon,
  CheckIcon,
  ChevronRightIcon,
  Edit2Icon,
  ExternalLinkIcon,
  InfoIcon,
  MapPinIcon,
  PhoneIcon,
  Trash2Icon,
} from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import { formatToRupiah } from '@/shared/lib/format';
import { Metadata } from '@/core/types/query';

import { ImageWithSkeleton } from '@/shared/components/app/image-with-skeleton';
import VenuePagination from '@/modules/venues/components/venue-list/venue-pagination';

type VenueListProps = {
  venuesPromise: Promise<{
    data: Omit<Venues, 'medias'>[];
    metadata: Metadata;
  }>;
  sportsPromise: Promise<Sports[]>;
};

export default function VenueList({
  venuesPromise,
  sportsPromise,
}: VenueListProps) {
  const { data: venues, metadata } = use(venuesPromise);
  const sports = use(sportsPromise);

  return (
    <>
      {venues.length > 0 ? (
        <div className="grid lg:grid-cols-2 gap-8">
          {venues.map((venue) => (
            <Card key={venue.id} className="overflow-hidden pt-0 group">
              <div className="relative h-50 overflow-hidden">
                <ImageWithSkeleton
                  src={venue.thumbnail.url}
                  alt={`Gambar utama ${venue.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="eager"
                  className="object-cover group-hover:scale-105 transition duration-500"
                />

                <div className="absolute top-0 w-full flex items-center justify-between gap-3 px-6 py-3">
                  <Badge className="capitalize">
                    <SportIcon
                      sportName={venue.sport.name as Sport}
                      className="size-5"
                    />
                    {venue.sport.name}
                  </Badge>

                  <div className="flex items-center gap-3">
                    <UpdateVenueDialog
                      venue={venue}
                      sports={sports}
                      renderTrigger={
                        <Button
                          size="icon-xs"
                          variant="secondary"
                          className="cursor-pointer"
                        >
                          <Edit2Icon />
                        </Button>
                      }
                    />
                    <DeleteVenueDialog
                      id={venue.id}
                      name={venue.name}
                      renderTrigger={
                        <Button
                          size="icon-xs"
                          variant="secondary"
                          className="cursor-pointer"
                        >
                          <Trash2Icon />
                        </Button>
                      }
                    />
                  </div>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="font-bold">{venue.name}</CardTitle>
                <CardDescription className="space-y-2">
                  <span className="flex items-start gap-1 text-xs!">
                    <MapPinIcon className="shrink-0 size-3.5" /> {venue.address}
                  </span>
                  <Separator />
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-start gap-1 text-xs!">
                        <PhoneIcon className="shrink-0 size-3.5" />{' '}
                        {venue.phoneNumber}
                      </span>
                      <span className="flex items-start gap-1 text-xs!">
                        <BanknoteIcon className="shrink-0 size-3.5" />{' '}
                        {formatToRupiah(Number(venue.fee))} / jam
                      </span>
                    </div>
                    <Link
                      href={venue.googleMapsUrl}
                      target="_blank"
                      className="ml-auto"
                    >
                      <Button
                        variant="link"
                        size="xs"
                        className="cursor-pointer"
                      >
                        Lihat Maps
                        <ExternalLinkIcon />
                      </Button>
                    </Link>
                  </div>
                  {venue.facilities!.length > 0 && (
                    <div>
                      {venue.facilities!.map((facility, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="mr-2 mb-2"
                        >
                          <CheckIcon />
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-accent py-6 space-y-3 mt-auto">
                <span className="font-bold flex items-center gap-2">
                  Daftar Lapangan Tersedia{' '}
                  <span className="rounded-full size-4 bg-primary text-primary-foreground flex items-center justify-center text-xs">
                    {venue.courts.length}
                  </span>
                </span>
                <div className="grid sm:grid-cols-2 gap-3">
                  {venue.courts.map((court) => (
                    <Item key={court.id} variant="outline">
                      <ItemContent>
                        <ItemTitle>{court.name}</ItemTitle>
                      </ItemContent>
                      {court.specifications &&
                        court.specifications.length > 0 && (
                          <ItemActions>
                            <Tooltip>
                              <TooltipTrigger
                                render={
                                  <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    className="cursor-pointer"
                                  >
                                    <InfoIcon />
                                  </Button>
                                }
                              />
                              <TooltipContent className="flex-col items-start gap-2 py-3">
                                <span className="font-bold">
                                  Spesifikasi Lapangan:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {court.specifications?.map(
                                    (specification, index) => (
                                      <Badge key={index}>
                                        <CheckIcon />
                                        {specification}
                                      </Badge>
                                    ),
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </ItemActions>
                        )}
                    </Item>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/dashboard/venues/${venue.id}`}
                  className="ml-auto"
                >
                  <Button
                    variant="secondary"
                    size="xs"
                    className="cursor-pointer"
                  >
                    Lihat selengkapnya <ChevronRightIcon />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}

          <VenuePagination metadata={metadata} />
        </div>
      ) : (
        <Empty className="mx-auto">
          <EmptyHeader className="max-w-lg">
            <EmptyMedia variant="icon">
              <CourtIcon />
            </EmptyMedia>

            <EmptyTitle>Belum Ada Lapangan</EmptyTitle>

            <EmptyDescription>
              Belum ada lapangan yang ditambahkan. Tambahkan tempat beserta
              lapangannya untuk mulai mengelola pertandingan.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </>
  );
}
