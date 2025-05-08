// src/hooks/useGameData.ts
import { useState, useEffect, useCallback } from 'react';
import { GameRecord } from '@/types';

export function useGameData() {
  const [gamesMap, setGamesMap] = useState<Record<string, GameRecord>>({});

  // load once from localStorage
  useEffect(() => {
    const raw = localStorage.getItem('bf:games');
    if (!raw) return;
    try {
      setGamesMap(JSON.parse(raw));
    } catch (err) {
      console.error('Failed to parse stored games:', err);
    }
  }, []);

  // save helper
  const saveGame = useCallback((record: GameRecord) => {
    setGamesMap((prev) => {
      const next = { ...prev, [record.id]: record };
      localStorage.setItem('bf:games', JSON.stringify(next));
      return next;
    });
  }, []);

  // derived array
  const games = Object.values(gamesMap);

  return { gamesMap, games, saveGame };
}
