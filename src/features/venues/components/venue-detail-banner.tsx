'use client';

import useCarousel from '@/hooks/use-carousel';
import '@fancyapps/ui/dist/carousel/carousel.css';
import { Arrows } from '@fancyapps/ui/dist/carousel/carousel.arrows';
import '@fancyapps/ui/dist/carousel/carousel.arrows.css';
import { Fancybox } from '@fancyapps/ui/dist/fancybox';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { MapPinIcon, Maximize2Icon } from 'lucide-react';
import { cn, formatToRupiah } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Venues } from '@/database/types';
import { Badge } from '@/components/ui/badge';
import SportIcon from '@/components/app/icon/sports';
import { Sport } from '@/constants/sports';
import CourtIcon from '@/components/app/icon/court';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import VenueTabsList from '@/features/venues/components/venue-detail-tabs/tabs-list';

const images = [
  {
    src: 'https://images.pexels.com/photos/7438732/pexels-photo-7438732.jpeg',
    alt: 'Shuttlecock di lapangan badminton',
  },
  {
    src: 'https://images.pexels.com/photos/8007418/pexels-photo-8007418.jpeg',
    alt: 'Pertandingan badminton di lapangan',
  },
  {
    src: 'https://images.pexels.com/photos/8713604/pexels-photo-8713604.jpeg',
    alt: 'Pemain sedang bermain badminton',
  },
  {
    src: 'https://images.pexels.com/photos/8007094/pexels-photo-8007094.jpeg',
    alt: 'Pemain badminton di lapangan indoor',
  },
];

export default function VenueDetailBanner({ venue }: { venue: Venues }) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const { setElement, onMouseDown, onMouseMove, stopDragging } =
    useDragScroll<HTMLDivElement>();

  const [carouselRef, carouselIntanceRef] = useCarousel({
    plugins: { Arrows },
    gestures: false,
    on: {
      change: (carousel) => {
        setActiveIndex(carousel.getPageIndex());
      },
    },
  });

  useEffect(() => {
    thumbnailRefs.current[activeIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [activeIndex]);

  useEffect(() => {
    const selector = '[data-fancybox="venue-gallery"]';

    Fancybox.bind(selector);

    return () => {
      Fancybox.unbind(selector);
    };
  }, []);

  return (
    <Card className="gap-0 p-0 overflow-hidden rounded-3xl flex flex-col">
      <div className="flex-1 relative">
        <div
          ref={carouselRef}
          className={cn(
            'f-carousel w-full h-80',
            '[&_.f-button]:opacity-0 [&_.f-button]:transition-opacity [&_.f-button]:duration-200 hover:[&_.f-button]:opacity-100',
          )}
        >
          {images.map((image, index) => (
            <div key={index} className="f-carousel__slide group">
              <a
                href={image.src}
                data-fancybox="venue-gallery"
                data-caption={image.alt}
                draggable="false"
                className="relative block size-full after:absolute after:inset-0 after:bg-linear-to-t after:from-black/80 after:to-transparent"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  loading="eager"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </a>
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 left-4 z-2 space-y-2 inline-block">
          <h1 className="text-3xl font-black text-white">{venue.name}</h1>
          <span className="flex gap-2 text-white">
            <MapPinIcon className="size-5 text-green-700 shrink-0" /> {venue.address}
          </span>
        </div>

        <div className="absolute top-4 left-4 z-2 inline-flex items-center gap-3">
          <Badge className="capitalize">
            <SportIcon sportName={venue.sport.name as Sport} />
            {venue.sport.name}
          </Badge>
          <Badge className="capitalize" variant="secondary">
            <CourtIcon />
            {venue.courts.length} Lapangan
          </Badge>
        </div>

        <div className="absolute top-4 right-4 z-2 inline-flex items-center gap-3">
          <Badge variant="secondary">
            {formatToRupiah(Number(venue.fee))} / jam
          </Badge>
        </div>
      </div>

      <div className="bg-accent flex items-center justify-between gap-3 p-3">
        <div
          className="flex gap-3 overflow-x-auto no-scrollbar select-none cursor-pointer"
          ref={setElement}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
        >
          {images.map((image, index) => (
            <button
              key={index}
              ref={(element) => {
                thumbnailRefs.current[index] = element;
              }}
              type="button"
              onClick={() => carouselIntanceRef?.goTo(index)}
              aria-label={`Lihat gambar ${index + 1}`}
              aria-current={activeIndex === index ? 'true' : undefined}
              className={cn(
                'cursor-pointer relative h-14 w-22 shrink-0 overflow-hidden rounded-xl border-2 transition',
                'border-transparent opacity-60 hover:opacity-100',
                activeIndex === index && 'border-green-700 opacity-100',
              )}
            >
              <Image
                src={image.src}
                alt={image.alt}
                loading="eager"
                fill
                sizes="112px"
                className="object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>

        <Button
          size="sm"
          variant="outline"
          className="cursor-pointer"
          onClick={() => {
            Fancybox.fromSelector('[data-fancybox="venue-gallery"]', {
              startIndex: activeIndex,
            });
          }}
        >
          <Maximize2Icon />
          Layar Penuh
        </Button>
      </div>

      <VenueTabsList />
    </Card>
  );
}
