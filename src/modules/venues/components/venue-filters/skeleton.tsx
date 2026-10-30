import { Card } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function VenueFiltersSkeleton() {
  return (
    <Card className="grid grid-cols-4 gap-3 p-6">
      <Skeleton className="col-span-3 h-8 w-full" />
      <div className="col-span-1 grid grid-cols-3 gap-3">
        <Skeleton className="h-8" />
        <Skeleton className="h-8" />
        <Skeleton className="h-8" />
      </div>
    </Card>
  );
}
