'use client';

import { useUser } from '@/components/providers/user-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { getInitials } from '@/lib/utils';
import {
  AlertCircle,
  ArrowRight,
  CalendarClockIcon,
  ChevronRight,
  CreditCardCheck,
  CreditCardIcon,
  MapPinIcon,
  PlusCircleIcon,
  QrCodeIcon,
  TrophyIcon,
  Users2Icon,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="p-6 space-y-8">
      <Card className="p-6 flex-row justify-between flex-wrap">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="inline-block size-3 rounded-full bg-green-700 animate-pulse" />
            <h1 className="text-green-700 font-bold">DASBOR KOMUNITAS</h1>
          </div>
          <span className="inline-block text-3xl font-bold">
            Halo {user?.name}
          </span>
          <p className="text-muted-foreground">
            Ada{' '}
            <span className="font-medium text-green-700">
              3 pertandingan aktif
            </span>{' '}
            yang terjadwal. Saat ini terdapat{' '}
            <span className="font-medium text-orange-700">
              3 bukti pembayaran tertunda
            </span>{' '}
            yang menunggu verifikasi Anda.
          </p>
        </div>
        <div className="flex items-center flex-wrap gap-3">
          <Button className="cursor-pointer">
            <PlusCircleIcon />
            Buat Pertandingan
          </Button>
          <Button variant="secondary" className="cursor-pointer">
            <CreditCardCheck />
            Verifikasi Pembayaran
          </Button>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <Link href="/dashboard/matches">
          <Card className="group hover:outline-1 hover:outline-green-700 transition duration-200 h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-muted-foreground text-sm">
                  JADWAL PERTANDINGAN
                </CardTitle>
                <div className="bg-green-700/30 rounded-full p-2">
                  <TrophyIcon className="size-5 text-green-700 group-hover:animate-bounce" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <span className="text-4xl font-bold mr-2">3</span>
                <span className="text-muted-foreground">terjadwal</span>
              </div>
            </CardContent>
            <CardFooter className="flex items-center gap-1 text-green-700 mt-auto">
              <span>Kelola pertandingan</span>{' '}
              <ArrowRight className="size-4 group-hover:translate-x-1 transition duration-200" />
            </CardFooter>
          </Card>
        </Link>
        <Link href="/dashboard/members">
          <Card className="group hover:outline-1 hover:outline-sky-700 transition duration-200 h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-muted-foreground text-sm">
                  TOTAL MEMBER
                </CardTitle>
                <div className="bg-sky-700/30 rounded-full p-2">
                  <Users2Icon className="size-5 text-sky-700 group-hover:animate-bounce" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <span className="text-4xl font-bold mr-2">53</span>
                <span className="text-muted-foreground">terdaftar</span>
              </div>
            </CardContent>
            <CardFooter className="flex items-center gap-1 text-sky-700 mt-auto">
              <span>Kelola member</span>{' '}
              <ArrowRight className="size-4 group-hover:translate-x-1 transition duration-200" />
            </CardFooter>
          </Card>
        </Link>
        <Link href="/dashboard/payments">
          <Card className="group hover:outline-1 hover:outline-orange-700 transition duration-200 h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-muted-foreground text-sm">
                  PEMBAYARAN TERTUNDA
                </CardTitle>
                <div className="bg-orange-700/30 rounded-full p-2">
                  <CreditCardIcon className="size-5 text-orange-700 group-hover:animate-bounce" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <span className="text-4xl font-bold mr-2">8</span>
                <span className="text-muted-foreground">
                  perlu diverifikasi
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex items-center gap-1 text-orange-700 mt-auto">
              <span>Tinjau bukti pembayaran</span>{' '}
              <ArrowRight className="size-4 group-hover:translate-x-1 transition duration-200" />
            </CardFooter>
          </Card>
        </Link>
        <Link href="/dashboard/matches">
          <Card className="group hover:outline-1 hover:outline-yellow-700 transition duration-200 h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-muted-foreground text-sm">
                  KEHADIRAN BULAN INI
                </CardTitle>
                <div className="bg-yellow-700/30 rounded-full p-2">
                  <QrCodeIcon className="size-5 text-yellow-700 group-hover:animate-bounce" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <span className="text-4xl font-bold mr-2">93%</span>
                <span className="text-muted-foreground">kehadiran</span>
              </div>
            </CardContent>
            <CardFooter className="flex items-center gap-1 text-yellow-700 mt-auto">
              <span>Buka absensi QR</span>{' '}
              <ArrowRight className="size-4 group-hover:translate-x-1 transition duration-200" />
            </CardFooter>
          </Card>
        </Link>
      </div>

      <div className="grid xl:grid-cols-12 gap-6">
        <div className="flex flex-col gap-6 xl:col-span-8 max-xl:order-2">
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div>
              <span className="text-xl font-bold">Pertandingan Mendatang</span>
              <p className="text-muted-foreground text-sm">
                Aktivitas utama yang berlangsung minggu ini di berbagai
                lapangan.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-1 text-sm hover:underline underline-offset-4"
            >
              <span>Lihat semua</span> <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="flex flex-col gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card className="gap-2" key={index}>
                <CardHeader className="flex items-center justify-between flex-wrap">
                  <Badge variant="outline" className="p-2.5">
                    🏸 Badminton
                  </Badge>
                  <Button className="cursor-pointer" size="xs">
                    Kelola Pertandingan <ArrowRight />
                  </Button>
                </CardHeader>

                <CardContent className="space-y-2">
                  <span className="text-lg font-bold inline-block">
                    Sunday Morning Badminton
                  </span>
                  <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarClockIcon className="size-3" />
                      <span className="text-xs">
                        Minggu, 20 September 2026 · 08:00 - 11:00
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPinIcon className="size-3" />
                      <span className="text-xs">
                        Senayan Sports Complex, Hall B
                      </span>
                    </div>
                  </div>
                </CardContent>

                <Separator className="my-3" />

                <CardFooter className="flex flex-wrap items-center gap-6">
                  <Progress
                    value={(28 / 28) * 100}
                    className="w-full md:flex-1 **:data-[slot=progress-indicator]:bg-sky-700 **:data-[slot=progress-track]:h-1.5"
                  >
                    <ProgressLabel>Peserta</ProgressLabel>
                    <ProgressValue render={<span>28/28</span>} />
                  </Progress>

                  <Progress
                    value={(3 / 28) * 100}
                    className="w-full md:flex-1 **:data-[slot=progress-indicator]:bg-orange-700 **:data-[slot=progress-track]:h-1.5"
                  >
                    <ProgressLabel>Pembayaran</ProgressLabel>
                    <ProgressValue render={<span>3/28</span>} />
                  </Progress>

                  <Progress
                    value={(10 / 28) * 100}
                    className="w-full md:flex-1 **:data-[slot=progress-indicator]:bg-yellow-700 **:data-[slot=progress-track]:h-1.5"
                  >
                    <ProgressLabel>Kehadiran</ProgressLabel>
                    <ProgressValue render={<span>10/28</span>} />
                  </Progress>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div className="xl:col-span-4 flex flex-col gap-6 max-xl:order-1">
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-block size-3 rounded-full bg-orange-700 animate-pulse" />
              <span className="text-xl font-bold">Perlu Perhatian</span>
            </div>
            <Badge
              variant="ghost"
              className="bg-orange-700/30 text-orange-700 pointer-events-none p-3"
            >
              5 Entri
            </Badge>
          </div>

          <Card>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-3">
                <span className="flex items-center gap-2 text-orange-700 font-medium">
                  <AlertCircle className="size-4" />
                  Verifikasi Pembayaran Diperlukan
                </span>
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card
                    key={index}
                    className="py-2 px-3 flex-row gap-2 items-center"
                  >
                    <Avatar>
                      <AvatarImage
                        src={
                          user?.image ??
                          `https://api.dicebear.com/10.x/notionists/svg?seed=${user?.id ?? 'user'}`
                        }
                        alt={user?.name ?? 'user'}
                      />
                      <AvatarFallback>
                        {getInitials(user?.name ?? 'User')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="leading-4">
                      <span className="inline-block">{user?.name}</span>
                      <span className="inline-block text-xs text-muted-foreground">
                        Rp 15.000 · Sunday Morning Badminton
                      </span>
                    </div>
                    <Button size="xs" className="cursor-pointer ml-auto">
                      Tinjau
                    </Button>
                  </Card>
                ))}
                <Link
                  href="/dashboard/payments"
                  className="flex items-center gap-1 ml-auto hover:underline underline-offset-4 transition"
                >
                  <span>Selengkapnya</span> <ArrowRight className="size-4" />
                </Link>
              </div>

              <Separator />

              <div className="flex flex-col gap-3">
                <span className="flex items-center gap-2 text-yellow-700 font-medium">
                  <QrCodeIcon className="size-4" />
                  Meja Absensi QR
                </span>
                <p className="text-muted-foreground">
                  Tampilkan kode QR pada tablet atau layar untuk peserta yang
                  datang.
                </p>
                <Link href="/dashboard/attendances">
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer text-yellow-700!"
                  >
                    <QrCodeIcon /> Buka Tampilan Absensi QR
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
