'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useQueryParams } from '@/shared/hooks/use-query-params';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { Spinner } from '@/shared/components/ui/spinner';
import { use, useEffect, useState } from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/shared/components/ui/input-group';
import { Card, CardContent } from '@/shared/components/ui/card';
import { SearchIcon } from 'lucide-react';
import { Sports, Venues } from '@/core/database/types';
import { Metadata } from '@/core/types/query';
import { usePathname } from 'next/navigation';

type Props = {
  queryString: string;
  venuesPromise: Promise<{
    data: Omit<Venues, 'medias'>[];
    metadata: Metadata;
  }>;
  sportsPromise: Promise<Sports[]>;
};

export default function VenueFilters({
  queryString,
  venuesPromise,
  sportsPromise,
}: Props) {
  const { metadata } = use(venuesPromise);
  const sports = use(sportsPromise);

  const pathname = usePathname();

  useEffect(() => {
    const url = `${pathname}?${queryString}${window.location.hash}`;
    const currentUrl = window.location.pathname + window.location.search + window.location.hash;

    if (url !== currentUrl) {
      window.history.replaceState(null, '', url);
    }
  }, [pathname, queryString]);

  const { getParam, setParams } = useQueryParams();
  const [keyword, setKeyword] = useState(getParam('keyword') ?? '');
  const { debouncedValue: debouncedKeyword, isDebouncing } = useDebounce(
    keyword,
    1000,
  );

  useEffect(() => {
    const currentKeyword = getParam('keyword') ?? '';

    if (debouncedKeyword === currentKeyword) return;

    setParams(
      { keyword: debouncedKeyword || undefined, page: 1 },
      { replace: true },
    );
  }, [debouncedKeyword, getParam, setParams]);

  const selectSportItems = [
    { label: 'Semua Olahraga', value: 'all' },
    ...sports.map(({ name }) => ({ label: name, value: name })),
  ];

  const selectLimitItems = [
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
  ];

  return (
    <Card>
      <CardContent className="flex items-center gap-3 max-md:flex-wrap">
        <InputGroup>
          <InputGroupInput
            placeholder="Cari nama tempat atau alamat..."
            value={keyword}
            maxLength={100}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            {isDebouncing ? <Spinner /> : `${metadata.total} hasil`}
          </InputGroupAddon>
        </InputGroup>

        <Select
          items={selectSportItems}
          value={getParam('sport') ?? 'all'}
          onValueChange={(value) => {
            if (value) {
              setParams({ sport: value === 'all' ? undefined : value });
            }
          }}
        >
          <SelectTrigger className="w-full max-w-42 cursor-pointer">
            <SelectValue className="capitalize" />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectGroup>
              {selectSportItems.map((item, index) => (
                <SelectItem
                  key={index}
                  value={item.value}
                  className="capitalize cursor-pointer"
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          items={selectLimitItems}
          value={Number(getParam('limit') ?? 10)}
          onValueChange={(value) => setParams({ limit: value })}
        >
          <SelectTrigger className="w-full max-w-20 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectGroup>
              {selectLimitItems.map((item, index) => (
                <SelectItem
                  key={index}
                  value={item.value}
                  className="cursor-pointer"
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
