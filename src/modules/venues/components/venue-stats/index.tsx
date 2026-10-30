import { getVenueStats } from '@/modules/venues/queries/get-venue-stats';
import CourtIcon from '@/shared/components/app/icon/court';
import { Card, CardContent } from '@/shared/components/ui/card';
import { MapPinnedIcon, TrophyIcon } from 'lucide-react';

export default async function VenueStats() {
  const { totalVenues, totalCourts, totalSports } = await getVenueStats();

  return (
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
                {totalVenues}
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
                {totalCourts}
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
                {totalSports}
              </span>{' '}
              cabang
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
