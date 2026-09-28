import { NavigationType } from '@/types/navigation';
import {
  CreditCardIcon,
  LayoutDashboard,
  MapPinnedIcon,
  QrCodeIcon,
  SettingsIcon,
  TrophyIcon,
  Users2Icon,
} from 'lucide-react';

export const dashboardNavigation: NavigationType = [
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
            href: '/dashboard/matches',
            permission: { matches: ['list'] },
          },
          {
            title: 'Buat Pertandingan',
            href: '/dashboard/matches/create',
            permission: { matches: ['create'] },
          },
          {
            title: 'Pencarian Lawan',
            href: '/dashboard/matches/matchmaking',
            permission: { matches: ['create-matchmaking'] },
          },
        ],
      },
      {
        title: 'Absensi QR',
        href: '/dashboard/attendances',
        icon: QrCodeIcon,
      },
      {
        title: 'Tempat & Lapangan',
        href: '/dashboard/venues',
        icon: MapPinnedIcon,
        permission: { venues: ['list'] },
      },
      {
        title: 'Anggota',
        href: '/dashboard/members',
        icon: Users2Icon,
        permission: { members: ['list'] },
      },
      {
        title: 'Rekening Pembayaran',
        href: '/dashboard/payment-accounts',
        icon: CreditCardIcon,
        permission: { paymentAccounts: ['list'] },
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
