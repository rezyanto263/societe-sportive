import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Field,
  FieldGroup,
  FieldSeparator,
} from '@/shared/components/ui/field';

export default function LoadingSignInPage() {
  return (
    <div className="flex flex-col gap-6">
      <FieldGroup>
        {/* Heading */}
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>

        {/* Phone number */}
        <Field>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-full" />
        </Field>

        {/* Password */}
        <Field>
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-9 w-full" />
        </Field>

        {/* Submit button */}
        <Field>
          <Skeleton className="h-9 w-full" />
        </Field>

        {/* Separator */}
        <FieldSeparator>Atau lanjutkan dengan</FieldSeparator>

        {/* Google button and sign-up link */}
        <Field>
          <Skeleton className="h-9 w-full" />

          <div className="flex items-center justify-center gap-1 pt-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-12" />
          </div>
        </Field>
      </FieldGroup>
    </div>
  );
}