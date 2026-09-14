import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground overflow-hidden">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={24}
                height={24}
                loading="eager"
                className="size-full"
              />
            </div>
            Société Sportive.
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="https://images.pexels.com/photos/38233848/pexels-photo-38233848.jpeg"
          alt="Image"
          width={800}
          height={800}
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
