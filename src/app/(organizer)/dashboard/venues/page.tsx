import { Card, CardContent } from '@/components/ui/card';
import { getSports } from '@/features/matches/queries/get-sports';
import { getVenues } from '@/features/venues/queries/get-venues';
import CreateVenueDialog from '@/features/venues/components/create-dialog';
import { MapPinnedIcon, TrophyIcon } from 'lucide-react';
import CourtIcon from '@/components/app/icon/court';
import ListVenues from '@/features/venues/components/list-venues';
import RefreshButton from '@/components/app/refresh-button';

export default async function ListVenuePage({}) {
  const sports = await getSports();
  const venues = await getVenues();

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

          <CreateVenueDialog sports={sports} />
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="p-3.5 bg-green-700/20 rounded-xl">
              <MapPinnedIcon className="text-green-700 size-7" />
            </div>
            <div className="text-muted-foreground flex flex-col gap-1">
              <span>TOTAL TEMPAT SEWA</span>
              <span>
                <span className="text-primary font-bold text-3xl mr-1">
                  {venues.length}
                </span>{' '}
                lokasi
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="p-3.5 bg-blue-700/20 rounded-xl">
              <CourtIcon className="text-blue-700 size-7" />
            </div>
            <div className="text-muted-foreground flex flex-col gap-1">
              <span>TOTAL LAPANGAN</span>
              <span>
                <span className="text-primary font-bold text-3xl mr-1">
                  {venues.reduce((acc, venue) => acc + venue.courts.length, 0)}
                </span>{' '}
                lapangan
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="p-3.5 bg-yellow-700/20 rounded-xl">
              <TrophyIcon className="text-yellow-700 size-7" />
            </div>
            <div className="text-muted-foreground flex flex-col gap-1">
              <span>TOTAL CABANG OLAHRAGA</span>
              <span>
                <span className="text-primary font-bold text-3xl mr-1">
                  {sports.length}
                </span>{' '}
                cabang
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ListVenues venues={venues} sports={sports} />
    </div>
  );
}
