'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useVenueDetailTab } from '@/features/venues/hooks/use-venue-detail-tabs';
import { useDragScroll } from '@/hooks/use-drag-scroll';

export default function VenueTabsList() {
  const { activeTab, setTab } = useVenueDetailTab();
  const { setElement, onMouseDown, onMouseMove, stopDragging } =
    useDragScroll<HTMLDivElement>();

  return (
    <Tabs
      value={activeTab}
      onValueChange={setTab}
      className="overflow-x-auto no-scrollbar select-none mx-3"
      ref={setElement}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
    >
      <TabsList variant="line" className="h-fit!">
        <TabsTrigger className="cursor-pointer py-2.5" value="information">
          Fasilitas & Rincian
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer py-2.5" value="courts">
          Daftar Lapangan
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer py-2.5" value="gallery">
          Galeri Foto
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer py-2.5" value="match">
          Sesi Pertandingan
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
