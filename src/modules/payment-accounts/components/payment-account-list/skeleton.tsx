import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function PaymentAccountListSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="pb-0">
          <CardHeader className="flex items-center justify-between gap-3">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="w-20 h-5 shrink-0" />
              <Skeleton className="w-20 h-5 shrink-0" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="size-5 shrink-0" />
              <Skeleton className="size-5 shrink-0" />
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <Skeleton className="w-70 h-8" />
            <div className="flex items-center gap-2">
              <Skeleton className="size-5" />
              <Skeleton className="w-40 h-5" />
            </div>
            <Skeleton className="h-20" />
            <Separator />
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <Skeleton className="w-30 h-5" />
              <Skeleton className="w-40 h-5" />
            </div>
            <Skeleton className="h-15" />
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <Skeleton className="w-30 h-5" />
              <Skeleton className="w-40 h-5" />
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between gap-3 bg-muted/30 py-3">
            <div className="flex items-center gap-2">
              <Skeleton className="size-5" />
              <Skeleton className="w-30 h-5" />
            </div>
            <Skeleton className="w-40 h-5 max-w-full ml-auto" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
