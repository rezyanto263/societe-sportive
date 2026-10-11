'use client';

import { useCallback, useEffect } from 'react';
import { DEFAULT_TAB, VENUE_TABS, VenueTab } from '@/constants/venues';
import { usePathname, useSearchParams } from 'next/navigation';

export function isValidTab(value: string | null): value is VenueTab {
  return value !== null && VENUE_TABS.includes(value as VenueTab);
}

export function useVenueDetailTab() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const tabParam = searchParams.get('tab');
  const activeTab: VenueTab = isValidTab(tabParam)
    ? tabParam
    : DEFAULT_TAB;

  const setTab = useCallback(
    (value: string) => {
      if (!isValidTab(value)) return;

      const params = new URLSearchParams(window.location.search);
      params.set('tab', value);

      window.history.replaceState(
        null,
        '',
        `${pathname}?${params.toString()}${window.location.hash}`,
      );
    },
    [pathname],
  );

  useEffect(() => {
    if (tabParam === activeTab) return;

    const params = new URLSearchParams(window.location.search);
    params.set('tab', activeTab);

    window.history.replaceState(
      null,
      '',
      `${pathname}?${params.toString()}${window.location.hash}`,
    );
  }, [tabParam, activeTab, pathname]);

  return { activeTab, setTab };
}