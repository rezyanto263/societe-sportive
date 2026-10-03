'use client';

import CourtIcon from '@/components/app/icon/court';
import SportIcon from '@/components/app/icon/sports';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Sport } from '@/constants/sports';
import UpdateVenueDialog from '@/features/venues/components/update-dialog';
import { Sports } from '@/types/sport';
import { Venues } from '@/types/venues';
import {
  BanknoteIcon,
  CheckIcon,
  ChevronRightIcon,
  Edit2Icon,
  ExternalLinkIcon,
  InfoIcon,
  MapPinIcon,
  PhoneIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type ListVenuesProps = {
  venues: Venues[];
  sports: Sports[];
};

export default function ListVenues({ venues, sports }: ListVenuesProps) {
  const [keyword, setKeyword] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('all');

  const filteredVenues = venues.filter((venue) => {
    const matchesKeyword =
      venue.name.toLowerCase().includes(keyword.toLowerCase()) ||
      venue.address.toLowerCase().includes(keyword.toLowerCase());

    const matchesSport =
      selectedSport === 'all' || venue.sportId === selectedSport;

    return matchesKeyword && matchesSport;
  });

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3 max-md:flex-wrap">
          <InputGroup>
            <InputGroupInput
              placeholder="Cari nama tempat atau alamat..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              {filteredVenues.length} hasil
            </InputGroupAddon>
          </InputGroup>

          <ToggleGroup
            value={[selectedSport]}
            onValueChange={(value) => {
              if (value.length > 0) {
                setSelectedSport(value[0]);
              }
            }}
            size="sm"
            className="max-md:flex-wrap"
          >
            <ToggleGroupItem
              value="all"
              variant="outline"
              className="cursor-pointer"
            >
              Semua Olahraga
            </ToggleGroupItem>
            {sports.map((sport) => (
              <ToggleGroupItem
                key={sport.id}
                value={sport.id}
                variant="outline"
                className="capitalize cursor-pointer"
              >
                {sport.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardContent>
      </Card>

      {filteredVenues.length > 0 ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredVenues.map((venue) => (
            <Card key={venue.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="outline" className="capitalize">
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
                    <Button
                      size="icon-xs"
                      variant="destructive"
                      className="cursor-pointer"
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                </div>
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
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(Number(venue.fee))}{' '}
                        / jam
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
