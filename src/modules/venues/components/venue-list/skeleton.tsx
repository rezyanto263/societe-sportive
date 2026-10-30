import { Card, CardFooter, CardHeader } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function VenueListSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="overflow-hidden pt-0">
          <Skeleton className="w-full h-50 rounded-b-none" />

          <CardHeader className="gap-3">
            <Skeleton className="w-70 max-w-full h-6" />
            <Skeleton className="w-full max-w-full h-4" />
            <Separator />
            <div className="grid grid-cols-4 gap-3">
              <Skeleton className="w-full max-w-full h-4" />
              <Skeleton className="w-full max-w-full h-4" />
              <Skeleton className="col-start-4 w-full max-w-full h-4" />
            </div>
            <div className="grid grid-cols-5 gap-3">
              <Skeleton className="w-full max-w-full h-4" />
              <Skeleton className="w-full max-w-full h-4" />
              <Skeleton className="w-full max-w-full h-4" />
              <Skeleton className="col-span-2 w-full max-w-full h-4" />
            </div>
          </CardHeader>

          <Skeleton className="w-full h-30 rounded-none" />

          <CardFooter>
            <Skeleton className="w-40 h-4 max-w-full ml-auto" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
