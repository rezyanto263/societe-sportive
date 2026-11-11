'use client';

import { PaymentAccounts } from '@/core/database/types';
import { Metadata } from '@/core/types/query';
import { PAYMENT_ACCOUNT_TYPES } from '@/modules/payment-accounts/constants';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/shared/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Spinner } from '@/shared/components/ui/spinner';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { useQueryParams } from '@/shared/hooks/use-query-params';
import { SearchIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { use, useEffect, useState } from 'react';

type Props = {
  queryString: string;
  paymentAccountsPromise: Promise<{
    data: PaymentAccounts[];
    metadata: Metadata;
  }>;
};

export default function PaymentAccountFilters({
  paymentAccountsPromise,
  queryString,
}: Props) {
  const { metadata } = use(paymentAccountsPromise);
  const pathname = usePathname();

  useEffect(() => {
    const url = `${pathname}?${queryString}${window.location.hash}`;
    const currentUrl =
      window.location.pathname + window.location.search + window.location.hash;

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

  const selectTypeItems = [
    { label: 'Semua Jenis', value: 'all' },
    ...Object.values(PAYMENT_ACCOUNT_TYPES).map((name) => ({
      label: name,
      value: name,
    })),
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
            placeholder="Cari nama rekening, penyedia layanan, pemilik rekening, atau nomor rekening..."
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
          items={selectTypeItems}
          value={getParam('type') ?? 'all'}
          onValueChange={(value) => {
            if (value) {
              setParams({ type: value === 'all' ? undefined : value });
            }
          }}
        >
          <SelectTrigger className="w-full max-w-42 cursor-pointer">
            <SelectValue className="capitalize" />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectGroup>
              {selectTypeItems.map((item, index) => (
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
