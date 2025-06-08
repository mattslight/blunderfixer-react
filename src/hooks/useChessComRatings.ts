import { useEffect, useState } from 'react';

import { useProfile } from './useProfile';

export type TimeClass = 'bullet' | 'blitz' | 'rapid';

interface Ratings {
  bullet?: number;
  blitz?: number;
  rapid?: number;
}

interface UseChessComRatings {
  rating: number | null;
  delta: number | null;
  timeClass: TimeClass;
  setTimeClass: (tc: TimeClass) => void;
  ratings: Ratings;
}

export function useChessComRatings(): UseChessComRatings {
  const {
    profile: { username },
  } = useProfile();

  const [ratings, setRatings] = useState<Ratings>({});
  const [previous, setPrevious] = useState<Ratings>({});
  const [timeClass, setTimeClassState] = useState<TimeClass>('blitz');

  // load stored previous ratings and preferred time class
  useEffect(() => {
    if (!username) return;
    try {
      const prevRaw = localStorage.getItem(`bf:elo_prev:${username}`);
      if (prevRaw) setPrevious(JSON.parse(prevRaw));
      const pref = localStorage.getItem(`bf:elo_pref:${username}`) as TimeClass;
      if (pref === 'bullet' || pref === 'blitz' || pref === 'rapid') {
        setTimeClassState(pref);
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

        setRatings({ bullet, blitz, rapid });

        // default preferred time class based on most games
        const prefKey = `bf:elo_pref:${username}`;
        if (!localStorage.getItem(prefKey)) {
          const counts: [TimeClass, number][] = [
            ['bullet', bulletGames],
            ['blitz', blitzGames],
            ['rapid', rapidGames],
          ];
          counts.sort((a, b) => b[1] - a[1]);
          setTimeClassState(counts[0][0]);
          localStorage.setItem(prefKey, counts[0][0]);
        }

        // store current as new previous for next login
        localStorage.setItem(
          `bf:elo_prev:${username}`,
          JSON.stringify({ bullet, blitz, rapid })
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

  return { rating, delta, timeClass, setTimeClass, ratings };
}
