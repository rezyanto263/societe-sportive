import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
export default function LoadingVenueDetailPage() {
  return (
    <div className="space-y-8 p-6">
      {/* Header actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-8 w-54 max-w-full" />
        <Skeleton className="h-8 w-49" />
      </div>

      {/* Venue detail card */}
      <Card className="gap-0 p-0 overflow-hidden rounded-3xl flex flex-col">
        {/* Banner / carousel */}
        <div className="relative h-80">
          <Skeleton className="absolute inset-0 rounded-none" />

          {/* Venue name and address */}
          <div className="absolute bottom-4 left-4 z-10 space-y-2">
            <Skeleton className="h-9 w-64 max-w-[75vw]" />
            <Skeleton className="h-5 w-52 max-w-[70vw]" />
          </div>

          {/* Badges */}
          <div className="absolute top-4 right-4 left-4 z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-full" />
            </div>

            <Skeleton className="h-4 w-24 rounded-full" />
          </div>
        </div>

        {/* Thumbnails and fullscreen button */}
        <div className="flex items-center justify-between gap-3 bg-accent px-3">
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-22 shrink-0 rounded-xl" />
            ))}
          </div>

          <Skeleton className="h-9 w-32 shrink-0" />
        </div>

        {/* Tabs list */}
        <div className="flex gap-2 overflow-hidden border-t p-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-30 shrink-0" />
          ))}
        </div>
      </Card>

      {/* Default information tab */}
      <div className="space-y-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Statistics and information */}
          <div className="col-span-12 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 xl:col-span-8 max-xl:order-2">
            {/* Statistics cards */}
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="p-4">
                <CardContent className="flex flex-col gap-2 px-0">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-3 w-32 max-w-full" />
                </CardContent>
              </Card>
            ))}

            <div className="col-span-2 flex flex-col gap-x-6 gap-y-8 lg:col-span-4">
              {/* Facilities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Skeleton className="size-5 shrink-0" />
                    <Skeleton className="h-5 w-52 max-w-full" />
                    <Skeleton className="size-5 shrink-0 rounded-full" />
                  </CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-12.5 w-full rounded-2xl" />
                  ))}
                </CardContent>
              </Card>

              {/* Important notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Skeleton className="size-5 shrink-0" />
                    <Skeleton className="h-5 w-64 max-w-full" />
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact and create match */}
          <div className="col-span-12 row-span-2 flex flex-col gap-x-6 gap-y-8 xl:col-span-4 max-xl:order-1">
            {/* Manager contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Skeleton className="size-5 shrink-0" />
                  <Skeleton className="h-5 w-56 max-w-full" />
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>

            {/* Create match CTA */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Skeleton className="size-5 shrink-0" />
                  <Skeleton className="h-5 w-56 max-w-full" />
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>

              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
