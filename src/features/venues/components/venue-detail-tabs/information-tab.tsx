'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Marker, MarkerContent } from '@/components/ui/marker';
import { Venues } from '@/database/types';
import {
  BadgeCheckIcon,
  ContactRoundIcon,
  MapPinIcon,
  NotebookTextIcon,
  PhoneIcon,
  PlusCircleIcon,
  StarsIcon,
  TrophyIcon,
} from 'lucide-react';
import Link from 'next/link';
import { formatPhoneNumberIntl } from 'react-phone-number-input';

export default function VenueInformationTab({ venue }: { venue: Venues }) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 xl:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 max-xl:order-2">
        <Card className="p-4">
          <CardContent className="flex flex-col gap-2 px-0">
            <span className="text-xs text-muted-foreground">
              JUMLAH LAPANGAN
            </span>
            <span className="text-2xl font-bold">{venue.courts.length}</span>
            <span className="text-xs text-muted-foreground">
              Tersedia untuk disewa
            </span>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="flex flex-col gap-2 px-0">
            <span className="text-xs text-muted-foreground">
              ESTIMASI TARIF
            </span>
            <span className="text-2xl font-bold">
              Rp{' '}
              <span className="lowercase">
                {new Intl.NumberFormat('en', {
                  notation: 'compact',
                  compactDisplay: 'short',
                  maximumFractionDigits: 1,
                }).format(Number(venue.fee))}
              </span>
            </span>
            <span className="text-xs text-muted-foreground">Per jam sewa</span>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="flex flex-col gap-2 px-0">
            <span className="text-xs text-muted-foreground">
              KATEGORI LAPANGAN
            </span>
            <span className="text-2xl font-bold capitalize">
              {venue.sport.name}
            </span>
            <span className="text-xs text-muted-foreground">
              Cabang olahraga
            </span>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="flex flex-col gap-2 px-0">
            <span className="text-xs text-muted-foreground">TOTAL SESI</span>
            <span className="text-2xl font-bold capitalize">4</span>
            <span className="text-xs text-muted-foreground">Pertandingan</span>
          </CardContent>
        </Card>

        <div className="col-span-2 lg:col-span-4 flex flex-col gap-x-6 gap-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-bold">
                <StarsIcon className="size-5 text-green-700" />
                FASILITAS & KENYAMANAN
                <Badge
                  className="rounded-full p-0 size-5 flex items-center justify-center shrink-0"
                  variant="secondary"
                >
                  {venue.facilities?.length ?? 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {venue.facilities ? (
                venue.facilities.map((facility, index) => (
                  <Item key={index} variant="outline" className="bg-accent">
                    <ItemMedia>
                      <BadgeCheckIcon className="size-5" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{facility}</ItemTitle>
                    </ItemContent>
                  </Item>
                ))
              ) : (
                <Marker variant="separator" className="col-span-3">
                  <MarkerContent>Belum ada yang ditambahkan</MarkerContent>
                </Marker>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-bold">
                <NotebookTextIcon className="size-5 text-green-700" /> CATATAN
                PENTING LAPANGAN
              </CardTitle>
            </CardHeader>
            <CardContent>
              {venue.notes ? (
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: venue.notes }}
                />
              ) : (
                <Marker variant="separator">
                  <MarkerContent>Tidak ada catatan</MarkerContent>
                </Marker>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="col-span-12 xl:col-span-4 row-span-2 flex flex-col gap-x-6 gap-y-8 max-xl:order-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-bold">
              <ContactRoundIcon className="size-5 text-green-700" /> KONTAK
              PENGELOLA LAPANGAN
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link href={`https://wa.me/${venue.phoneNumber}`}>
              <Button className="w-full cursor-pointer justify-between">
                <div className="flex items-center gap-2">
                  <PhoneIcon />
                  <span className="text-xs">
                    {formatPhoneNumberIntl(venue.phoneNumber)}
                  </span>
                </div>
                <span className="underline text-xs">Pesan via WhatsApp</span>
              </Button>
            </Link>

            <Link href={venue.googleMapsUrl} target="_blank">
              <Button className="w-full cursor-pointer" variant="secondary">
                <MapPinIcon />
                Buka Rute di Google Maps
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-green-950 to-emerald-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-bold text-green-700">
              <TrophyIcon className="size-5" />
              JADWALKAN PERTANDINGAN BARU
            </CardTitle>
          </CardHeader>
          <CardContent className='text-green-100'>
            Buka pembuatan pertandingan dengan tempat dan lapangan dari{' '}
            {venue.name} yang terpilih secara otomatis.
          </CardContent>
          <CardFooter>
            <Link
              href={`/dashboard/matches/create?venueId=${venue.id}`}
              className="w-full"
            >
              <Button className="w-full cursor-pointer bg-white! text-black!" variant="ghost">
                <PlusCircleIcon /> Buat Pertandingan
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
