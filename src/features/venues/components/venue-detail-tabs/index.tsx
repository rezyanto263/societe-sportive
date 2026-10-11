'use client';

import { Tabs, TabsContent } from '@/components/ui/tabs';
import VenueCourtsTab from '@/features/venues/components/venue-detail-tabs/courts-tab';
import VenueInformationTab from '@/features/venues/components/venue-detail-tabs/information-tab';
import { Venues } from '@/database/types';
import { useVenueDetailTab } from '@/features/venues/hooks/use-venue-detail-tabs';
import VenueGalleryTab from '@/features/venues/components/venue-detail-tabs/gallery-tab';
import VenueMatchTab from '@/features/venues/components/venue-detail-tabs/match-tab';

export default function VenueDetailTabs({ venue }: { venue: Venues }) {
  const { activeTab } = useVenueDetailTab();

  return (
    <Tabs value={activeTab}>
      <TabsContent value="information">
        <VenueInformationTab venue={venue} />
      </TabsContent>

      <TabsContent value="courts">
        <VenueCourtsTab venue={venue} />
      </TabsContent>

      <TabsContent value="gallery">
        <VenueGalleryTab venue={venue} />
      </TabsContent>

      <TabsContent value="match">
        <VenueMatchTab venue={venue} />
      </TabsContent>
    </Tabs>
  );
}
