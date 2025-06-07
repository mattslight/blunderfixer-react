import { useEffect, useState } from 'react';

const PREFIX = 'bf:params:';

export function useStickyValue<T>(
  key: string,
  defaultValue?: T
): [T | undefined, (v: T | ((prev: T | undefined) => T)) => void] {
  const storageKey = `${PREFIX}${key}`;

  const [value, setValue] = useState<T | undefined>(() => {
    const stickyValue = localStorage.getItem(storageKey);
    if (stickyValue !== null) {
      return JSON.parse(stickyValue);
    }
    return defaultValue;
  });

  useEffect(() => {
    if (value !== undefined) {
      localStorage.setItem(storageKey, JSON.stringify(value));
    }
  }, [storageKey, value]);

  return [value, setValue];
}
