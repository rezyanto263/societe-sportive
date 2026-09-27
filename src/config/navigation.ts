import {
  CreditCardIcon,
  LayoutDashboard,
  MapPinnedIcon,
  QrCodeIcon,
  SettingsIcon,
  TrophyIcon,
  Users2Icon,
} from 'lucide-react';

export const dashboardNavigation = [
  {
    title: 'MANAJEMEN',
    items: [
      {
        title: 'Beranda',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Pertandingan',
        icon: TrophyIcon,
        items: [
          {
            title: 'Semua Pertandingan',
            href: '/dashboard/matches'
          },
          {
            title: 'Buat Pertandingan',
            href: '/dashboard/matches/create'
          },
          {
            title: 'Pencarian Lawan',
            href: '/dashboard/matches/matchmaking'
          },
        ]
      },
      {
        title: 'Absensi QR',
        href: '/dashboard/attendances',
        icon: QrCodeIcon,
      },
      {
        title: 'Lapangan',
        href: '/dashboard/courts',
        icon: MapPinnedIcon,
      },
      {
        title: 'Anggota',
        href: '/dashboard/members',
        icon: Users2Icon,
      },
      {
        title: 'Rekening Pembayaran',
        href: '/dashboard/payment-accounts',
        icon: CreditCardIcon,
      },
    ],
  },
  {
    title: 'SISTEM',
    items: [
      {
        title: 'Pengaturan',
        href: '/dashboard/settings',
        icon: SettingsIcon,
      },
    ],
  },
];
