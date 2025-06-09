import { useEffect, useState } from 'react';

import { useProfile } from './useProfile';

export type TimeClass = 'bullet' | 'blitz' | 'rapid' | 'daily';

function isTimeClass(val: any): val is TimeClass {
  return val === 'bullet' || val === 'blitz' || val === 'rapid' || val === 'daily';
}

interface Ratings {
  bullet?: number;
  blitz?: number;
  rapid?: number;
  daily?: number;
}

interface UseChessComRatings {
  rating: number | null;
  delta: number | null;
  timeClass: TimeClass;
  setTimeClass: (tc: TimeClass) => void;
  ratings: Ratings;
  preferred: TimeClass[];
  setPreferred: (val: TimeClass[]) => void;
}

export function useChessComRatings(): UseChessComRatings {
  const {
    profile: { username },
  } = useProfile();

  const [ratings, setRatings] = useState<Ratings>({});
  const [previous, setPrevious] = useState<Ratings>({});
  const [timeClass, setTimeClassState] = useState<TimeClass>('blitz');
  const [preferred, setPreferredState] = useState<TimeClass[]>([]);

  // load stored previous ratings and preferred time class & list
  useEffect(() => {
    if (!username) return;
    try {
      const prevRaw = localStorage.getItem(`bf:elo_prev:${username}`);
      if (prevRaw) setPrevious(JSON.parse(prevRaw));
      const pref = localStorage.getItem(`bf:elo_pref:${username}`) as TimeClass;
      if (isTimeClass(pref)) {
        setTimeClassState(pref);
      }
      const listRaw = localStorage.getItem(`bf:elo_formats:${username}`);
      if (listRaw) {
        const arr = JSON.parse(listRaw);
        if (Array.isArray(arr)) setPreferredState(arr.filter(isTimeClass));
      }
    } catch {
      // ignore
    }
  }, [username]);

  // fetch current ratings
  useEffect(() => {
    if (!username) return;
    fetch(`https://api.chess.com/pub/player/${username}/stats`)
      .then((res) => res.json())
      .then((data) => {
        const bullet = data.chess_bullet?.last?.rating;
        const blitz = data.chess_blitz?.last?.rating;
        const rapid = data.chess_rapid?.last?.rating;
        const daily = data.chess_daily?.last?.rating;

        const bulletGames =
          (data.chess_bullet?.record?.win ?? 0) +
          (data.chess_bullet?.record?.loss ?? 0) +
          (data.chess_bullet?.record?.draw ?? 0);
        const blitzGames =
          (data.chess_blitz?.record?.win ?? 0) +
          (data.chess_blitz?.record?.loss ?? 0) +
          (data.chess_blitz?.record?.draw ?? 0);
        const rapidGames =
          (data.chess_rapid?.record?.win ?? 0) +
          (data.chess_rapid?.record?.loss ?? 0) +
          (data.chess_rapid?.record?.draw ?? 0);
        const dailyGames =
          (data.chess_daily?.record?.win ?? 0) +
          (data.chess_daily?.record?.loss ?? 0) +
          (data.chess_daily?.record?.draw ?? 0);

        setRatings({ bullet, blitz, rapid, daily });

        // default preferred time class based on most games
        const prefKey = `bf:elo_pref:${username}`;
        if (!localStorage.getItem(prefKey)) {
          const counts: [TimeClass, number][] = [
            ['bullet', bulletGames],
            ['blitz', blitzGames],
            ['rapid', rapidGames],
            ['daily', dailyGames],
          ];
          counts.sort((a, b) => b[1] - a[1]);
          setTimeClassState(counts[0][0]);
          localStorage.setItem(prefKey, counts[0][0]);
        }

        const listKey = `bf:elo_formats:${username}`;
        if (!localStorage.getItem(listKey)) {
          const detected: TimeClass[] = [];
          if (bulletGames > 0) detected.push('bullet');
          if (blitzGames > 0) detected.push('blitz');
          if (rapidGames > 0) detected.push('rapid');
          if (dailyGames > 0) detected.push('daily');
          const defaults = detected.length ? detected : ['blitz'];
          setPreferredState(defaults);
          localStorage.setItem(listKey, JSON.stringify(defaults));
          if (!defaults.includes(timeClass)) setTimeClassState(defaults[0]);
        }

        // store current as new previous for next login
        localStorage.setItem(
          `bf:elo_prev:${username}`,
          JSON.stringify({ bullet, blitz, rapid, daily })
        );
      })
      .catch(() => {
        // ignore errors
      });
  }, [username]);

  const rating = ratings[timeClass] ?? null;
  const delta =
    rating != null && previous[timeClass] != null
      ? rating - (previous[timeClass] as number)
      : null;

  const setTimeClass = (tc: TimeClass) => {
    setTimeClassState(tc);
    if (username) {
      localStorage.setItem(`bf:elo_pref:${username}`, tc);
    }
  };

  const setPreferred = (vals: TimeClass[]) => {
    if (!vals.length) return;
    setPreferredState(vals);
    if (username) {
      localStorage.setItem(`bf:elo_formats:${username}`, JSON.stringify(vals));
    }
    setTimeClassState((prev) => (vals.includes(prev) ? prev : vals[0]));
  };

  return { rating, delta, timeClass, setTimeClass, ratings, preferred, setPreferred };
}
