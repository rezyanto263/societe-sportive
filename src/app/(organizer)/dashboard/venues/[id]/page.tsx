import { Button } from '@/shared/components/ui/button';
import { ShareVenueWhatsAppButton } from '@/modules/venues/components/share-venue-whatsapp-button';
import VenueDetailBanner from '@/modules/venues/components/venue-detail-banner';
import VenueDetailTabs from '@/modules/venues/components/venue-detail-tabs';
import { getVenue } from '@/modules/venues/queries/get-venue';
import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import z from 'zod';

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isIdValid = z.uuid().safeParse(id).success;

  if (!isIdValid) notFound();

  const venue = await getVenue(id);

  if (!venue) notFound();

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link href="/dashboard/venues">
          <Button variant="secondary" size="sm" className="cursor-pointer">
            <ChevronLeftIcon />
            Kembali ke Daftar Tempat
          </Button>
        </Link>

        <ShareVenueWhatsAppButton
          name={venue.name}
          address={venue.address}
          courtCount={venue.courts.length}
          googleMapsUrl={venue.googleMapsUrl}
        />
      </div>

      <VenueDetailBanner venue={venue} />

      <VenueDetailTabs venue={venue} />
    </div>
  );
}
