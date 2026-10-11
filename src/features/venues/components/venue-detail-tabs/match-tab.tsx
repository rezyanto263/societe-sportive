import CourtIcon from '@/components/app/icon/court';
import SportIcon from '@/components/app/icon/sports';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Sport } from '@/constants/sports';
import { Venues } from '@/database/types';
import {
  CalendarIcon,
  ChevronRightIcon,
  ClockIcon,
  PlusCircleIcon,
} from 'lucide-react';
import Link from 'next/link';

export default function VenueMatchTab({ venue }: { venue: Venues }) {
  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-lg font-bold">
              Daftar Sesi Pertandingan di {venue.name}
            </h1>
            <p className="text-muted-foreground">
              Ditemukan 3 sesi pertandingan yang dijadwalkan di lapangan ini.
            </p>
          </div>

          <Button className="cursor-pointer">
            <PlusCircleIcon /> Tambah Pertandingan Baru
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <Badge variant="secondary" className="capitalize">
                  <SportIcon sportName={venue.sport.name as Sport} />
                  {venue.sport.name}
                </Badge>

                <Badge>Upcoming</Badge>
              </div>

              <CardTitle className="font-bold">
                Sunday Morning Badminton
              </CardTitle>
            </CardHeader>

            <CardContent className="text-muted-foreground space-y-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="size-4" /> <span>09-06-2026</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="size-4" /> <span>09:00 WITA</span>
              </div>
              <div className="flex items-center gap-2">
                <CourtIcon className="size-4" />{' '}
                <span>Lapangan A, Lapangan B, Lapangan C</span>
              </div>
            </CardContent>

            <CardFooter className="justify-between">
              <span>1 / 24 Peserta</span>
              <Link href="/dashboard/matches">
                <Button
                  variant="secondary"
                  size="sm"
                  className="cursor-pointer"
                >
                  Lihat selengkapnya <ChevronRightIcon />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
