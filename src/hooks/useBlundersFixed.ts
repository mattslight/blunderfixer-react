import { useEffect, useState } from 'react';

import { useProfile } from './useProfile';

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
    try {
      const raw = localStorage.getItem(`bf:blunders_fixed:${username}`);
      setCount(raw ? parseInt(raw, 10) : 0);
    } catch {
      setCount(0);
    }
  }, [username]);

  return count;
}
