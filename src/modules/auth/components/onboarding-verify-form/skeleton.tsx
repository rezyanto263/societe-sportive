import {
  Field,
  FieldGroup,
  FieldSeparator,
} from '@/shared/components/ui/field';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function OnboardingVerifyFormSkeleton() {
  return (
    <FieldGroup>
      {/* Judul dan deskripsi */}
      <div className="flex flex-col items-center gap-2 text-center">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-98 max-w-full" />
        <Skeleton className="h-4 w-90 max-w-full" />
      </div>

      {/* Input OTP dan countdown */}
      <Field className="mx-auto space-y-3">
        <div className="flex justify-center">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="size-10 rounded-none last:rounded-e-full first:rounded-s-full sm:size-12 md:h-15 md:w-18"
            />
          ))}
        </div>

        <Skeleton className="h-4 w-44! max-w-full mx-auto" />
      </Field>

      {/* Tombol verifikasi */}
      <Field>
        <Skeleton className="h-8 w-full" />

        <Skeleton className="h-4 w-84! mx-auto max-w-full" />
      </Field>

      <FieldSeparator>Atau</FieldSeparator>

      {/* Tombol keluar */}
      <Field>
        <Skeleton className="h-8 w-full" />
      </Field>
    </FieldGroup>
  );
}
