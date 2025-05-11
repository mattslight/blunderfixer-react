import { useEffect, useState } from 'react';

const PREFIX = 'bf:params:';

export function useStickyValue<T>(
  key: string,
  defaultValue: T
): [T, (v: T | ((prev: T) => T)) => void] {
  const storageKey = `${PREFIX}${key}`;

  const [value, setValue] = useState<T>(() => {
    const stickyValue = localStorage.getItem(storageKey);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [storageKey, value]);

  return [value, setValue];
}
