// src/hooks/useProfile.ts
import { useEffect, useState } from 'react';
import { useUsername } from './useUsername'; // pull in the core logic

export interface Profile {
  username: string;
  name?: string;
  avatar?: string;
  country?: string;
}

const EXTRA_KEY = 'bf:profileExtra';

export function useProfile(): {
  profile: Profile;
  setUsername: (u: string) => void;
} {
  // 1) grab username + setter from useUsername
  const { username, setUsername } = useUsername();

  // 2) keep extra fields in local state
  const [extra, setExtra] = useState<Omit<Profile, 'username'>>(() => {
    try {
      return JSON.parse(localStorage.getItem(EXTRA_KEY) || '{}');
    } catch {
      return {};
    }
  });

  // 3) whenever username changes, fetch the full chess.com profile
  useEffect(() => {
    if (!username) return;

    fetch(`https://api.chess.com/pub/player/${username.toLowerCase()}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: any) => {
        const fetched = {
          name: data.name,
          avatar: data.avatar,
          country: data.country,
        };
        setExtra(fetched);
        localStorage.setItem(EXTRA_KEY, JSON.stringify(fetched));
      })
      .catch(() => {
        // on error, clear extra
        setExtra({});
        localStorage.removeItem(EXTRA_KEY);
      });
  }, [username]);

  // 4) combine into one Profile object
  const profile: Profile = {
    username,
    ...extra,
  };

  // expose the same setter
  return { profile, setUsername };
}
