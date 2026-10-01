import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getSports } from '@/features/matches/actions/get-sports';
import CreateVenueDialog from '@/features/venues/components/create-dialog';
import { MapPinnedIcon, RefreshCwIcon } from 'lucide-react';

export default async function ListVenuePage() {
  const sports = await getSports();

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
          <Button variant="secondary" size="icon" className="cursor-pointer">
            <RefreshCwIcon />
          </Button>

          <CreateVenueDialog sports={sports} />
        </div>
      </Card>
    </div>
  );
}
