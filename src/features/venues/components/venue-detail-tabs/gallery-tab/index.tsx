'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Venues } from '@/database/types';
import ManagePhotoDialog from '@/features/venues/components/venue-detail-tabs/gallery-tab/manage-photo-dialog';
import DeletePhotoDialog from '@/features/venues/components/venue-detail-tabs/gallery-tab/delete-photo-dialog';
import useFancybox from '@/hooks/use-fancybox';
import { ImageOffIcon, ImagesIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';

export default function VenueGalleryTab({ venue }: { venue: Venues }) {
  const [fancyboxRef] = useFancybox();

  const images = venue.medias.map((media) => ({
    id: media.id,
    src: media.url,
    alt: `Foto di ${venue.name}`,
  }));

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-lg font-bold">Galeri Foto {venue.name}</h1>
            <p className="text-muted-foreground">
              Tersedia {images.length} foto resmi lapangan, kondisi court, dan
              fasilitas pemain.
            </p>
          </div>

          <ManagePhotoDialog
            key={venue.medias.map((media) => media.id).join('|')}
            venueId={venue.id}
            name={venue.name}
            medias={venue.medias}
            renderTrigger={
              <Button className="cursor-pointer">
                <ImagesIcon /> Manajemen Galeri Foto
              </Button>
            }
          />
        </CardContent>
      </Card>

      {images.length > 0 ? (
        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          ref={fancyboxRef}
        >
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden p-0 group gap-0">
              <div className="relative aspect-video overflow-hidden">
                <a
                  data-fancybox="gallery"
                  href={image.src}
                  className="absolute inset-0"
                >
                  <Image
                    src={image.src}
                    alt="Lapangan badminton"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="eager"
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                </a>

                <DeletePhotoDialog
                  venueId={venue.id}
                  mediaId={image.id}
                  src={image.src}
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
            </Card>
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyHeader className="max-w-lg">
            <EmptyMedia variant="icon">
              <ImageOffIcon />
            </EmptyMedia>
            <EmptyTitle>Belum Ada Foto</EmptyTitle>
            <EmptyDescription>
              Belum ada foto yang ditambahkan ke galeri tempat ini. Foto akan
              ditampilkan di sini agar Anda dapat melihat fasilitas dan suasana
              lokasi.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}
