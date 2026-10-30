'use client';

import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  const isDebouncing = !Object.is(value, debouncedValue);

  return {
    debouncedValue,
    isDebouncing,
  };
}