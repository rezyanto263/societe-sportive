type CreatePageUrlOptions = {
  pathname: string;
  searchParams: URLSearchParams;
  value: string | number;
};

export function createPageUrl({
  pathname,
  searchParams,
  value,
}: CreatePageUrlOptions) {
  const params = new URLSearchParams(searchParams.toString());

  params.set('page', String(value));

  return `${pathname}?${params.toString()}`;
}
