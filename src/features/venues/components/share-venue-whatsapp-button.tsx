'use client';

import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ShareVenueWhatsAppButtonProps = {
  name: string;
  thumbnailUrl?: string;
  courtCount: number;
  address: string;
  googleMapsUrl: string;
};


const EMOJI = {
  title: String.fromCodePoint(0x1f3c5), // 🏅
  pin: String.fromCodePoint(0x1f4cd), // 📍
  court: String.fromCodePoint(0x1f3df), // 🏟 (tanpa variation selector)
  map: String.fromCodePoint(0x1f4cc), // 📌 (pengganti 🗺️ yang lebih kompatibel)
};

export function ShareVenueWhatsAppButton({
  name,
  courtCount,
  address,
  googleMapsUrl,
}: ShareVenueWhatsAppButtonProps) {
  function handleShare() {
    const message = [
      `${EMOJI.title} *${name}*`,
      '',
      `${EMOJI.pin} Alamat: ${address}`,
      `${EMOJI.court} Jumlah lapangan tersedia: ${courtCount} lapangan`,
      '',
      `${EMOJI.map} Lokasi Google Maps:`,
      googleMapsUrl,
    ].join('\n');

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      className="cursor-pointer"
      onClick={handleShare}
    >
      <Share2 />
      Bagikan via WhatsApp
    </Button>
  );
}
