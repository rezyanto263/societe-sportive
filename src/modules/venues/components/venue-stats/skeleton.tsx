import { Card } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function VenueStatsSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <div className="flex items-center gap-3 px-6 ">
            <Skeleton className="rounded-xl size-16 shrink-0" />
            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-4 w-2/3" />
              <div className="flex items-end gap-2">
                <Skeleton className="h-10 w-8 rounded-xl" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
