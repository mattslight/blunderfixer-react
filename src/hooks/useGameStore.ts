// src/hooks/useGameStore.ts

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'bf:games';

/**
 * The shape of your whole games map in localStorage:
 * { [gameId]: GameRecord }
 */
function readAllGames<T>(): Record<string, T> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    console.warn('Failed to parse bf:games from localStorage');
    return {};
  }
}

function writeAllGames<T>(all: Record<string, T>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

/**
 * Hook to read/write a single GameRecord in localStorage.
 *
 * @param gameId       Unique ID for this game (URL or hash)
 * @param initialData? If nothing exists yet under that ID, seed it
 */
export default function useGameStore<T extends { id: string }>(
  gameId: string,
  initialData?: T
) {
  // Load the full map, then pick out this one game
  const [allGames, setAllGames] = useState<Record<string, T>>(() =>
    readAllGames<T>()
  );
  const game = allGames[gameId] ?? initialData;

  // If we have an initialData and no entry in storage, write it once
  useEffect(() => {
    if (initialData && !allGames[gameId]) {
      const next = { ...allGames, [gameId]: initialData };
      setAllGames(next);
      writeAllGames(next);
    }
  }, [initialData, allGames, gameId]);

  // save(patch): merge your partial updates + updatedAt timestamp
  const save = useCallback(
    (patch: Partial<T>) => {
      const existing = allGames[gameId] || (initialData as T);
      const updated: T = {
        ...existing,
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      const next = { ...allGames, [gameId]: updated };
      setAllGames(next);
      writeAllGames(next);
    },
    [allGames, gameId, initialData]
  );

  return { game, save };
}
