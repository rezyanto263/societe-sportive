'use client';

import CourtIcon from '@/components/app/icon/court';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Venues } from '@/database/types';
import CreateCourtDialog from '@/features/venues/components/venue-detail-tabs/courts-tab/create-court-dialog';
import DeleteCourtDialog from '@/features/venues/components/venue-detail-tabs/courts-tab/delete-court-dialog';
import { CheckIcon, PlusCircleIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';

export default function VenueCourtsTab({ venue }: { venue: Venues }) {
  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-lg font-bold">
              Rincian Lapangan di {venue.name}
            </h1>
            <p className="text-muted-foreground">
              Total {venue.courts.length} lapangan tersedia untuk digunakan di
              sesi pertandingan.
            </p>
          </div>
          <CreateCourtDialog
            venueId={venue.id}
            name={venue.name}
            renderTrigger={
              <Button className="cursor-pointer">
                <PlusCircleIcon /> Tambah Lapangan Baru
              </Button>
            }
          />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venue.courts.map((court) => (
          <Card key={court.id} className="overflow-hidden p-0 group gap-0">
            <div className="relative aspect-video overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/8007094/pexels-photo-8007094.jpeg"
                alt="Lapangan badminton"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="eager"
                className="object-cover group-hover:scale-105 transition duration-500"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

              <CardTitle className="absolute bottom-3 left-3 font-bold text-lg text-white flex items-center gap-2">
                <CourtIcon className="text-green-700" /> {court.name}
              </CardTitle>

              <DeleteCourtDialog
                id={court.id}
                name={court.name}
                renderTrigger={
                  <Button
                    variant="secondary"
                    size="icon-sm"
                    className="absolute top-3 right-3 cursor-pointer"
                  >
                    <Trash2Icon />
                  </Button>
                }
              />
            </div>

            <CardHeader className="p-3">
              <CardDescription className="flex flex-wrap gap-2">
                <span className="w-full font-medium">Spesifikasi :</span>
                {court.specifications.map((specification, index) => (
                  <Badge key={index} variant="secondary">
                    <CheckIcon />
                    {specification}
                  </Badge>
                ))}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
