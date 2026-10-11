'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Venues } from '@/database/types';
import useFancybox from '@/hooks/use-fancybox';
import { PlusCircleIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';

export default function VenueGalleryTab({ venue }: { venue: Venues }) {
  const [fancyboxRef] = useFancybox();

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-lg font-bold">Galeri Foto {venue.name}</h1>
            <p className="text-muted-foreground">
              Tersedia 4 foto resmi lapangan, kondisi court, dan fasilitas
              pemain.
            </p>
          </div>
          <Button className="cursor-pointer">
            <PlusCircleIcon /> Tambah Foto Baru
          </Button>
        </CardContent>
      </Card>

      <div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        ref={fancyboxRef}
      >
        {Array.from({ length: 7 }).map((_, index) => (
          <Card key={index} className="overflow-hidden p-0 group gap-0">
            <div className="relative aspect-video overflow-hidden">
              <a
                data-fancybox="gallery"
                href="https://images.pexels.com/photos/32944292/pexels-photo-32944292.jpeg"
                className="absolute inset-0"
              >
                <Image
                  src="https://images.pexels.com/photos/32944292/pexels-photo-32944292.jpeg"
                  alt="Lapangan badminton"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="eager"
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </a>

              <Button
                variant="secondary"
                size="icon-sm"
                className="absolute top-3 right-3 cursor-pointer"
              >
                <Trash2Icon />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
