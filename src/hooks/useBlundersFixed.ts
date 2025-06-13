import { useEffect, useState } from 'react';

import { useProfile } from './useProfile';

import { getBlundersFixed } from '@/api/playerStats';

export default function useBlundersFixed() {
  const {
    profile: { username },
  } = useProfile();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!username) {
      setCount(0);
      return;
    }

    const key = `bf:blunders_fixed:${username}`;

    // Load any locally cached value first so UI isn't empty
    try {
      const raw = localStorage.getItem(key);
      if (raw) setCount(parseInt(raw, 10));
    } catch {
      // ignore parse errors
    }

    // Fetch latest count from API
    getBlundersFixed(username)
      .then((data) => {
        if (typeof data.blunders_fixed === 'number') {
          setCount(data.blunders_fixed);
          try {
            localStorage.setItem(key, String(data.blunders_fixed));
          } catch {
            // ignore storage failures
          }
        }
      })
      .catch(() => {
        // ignore errors and keep any local value
      });
  }, [username]);

  return count;
}
