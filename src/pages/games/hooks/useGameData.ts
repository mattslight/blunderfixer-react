// src/hooks/useGameData.ts
import { useState, useEffect, useCallback } from 'react';
import { GameRecord } from '@/types';

/**
 * Custom hook for managing persisted game records in localStorage.
 *
 * Loads all stored games on mount, provides a method to add or update games,
 * and exposes both the raw map and a derived array for rendering.
 *
 * @returns An object containing:
 *  - gamesMap: Record<string, GameRecord> — lookup table of games by ID.
 *  - games: GameRecord[] — array of all stored games (derived from gamesMap).
 *  - saveGame: (record: GameRecord) => void — function to add or update a game.
 */
export function useGameData() {
  // Internal map of game ID → GameRecord
  const [gamesMap, setGamesMap] = useState<Record<string, GameRecord>>({});

  // Load stored games from localStorage once
  useEffect(() => {
    const raw = localStorage.getItem('bf:games');
    if (!raw) return;
    try {
      setGamesMap(JSON.parse(raw));
    } catch (err) {
      console.error('Failed to parse stored games:', err);
    }
  }, []);

  // Helper to save or update a game record
  const saveGame = useCallback((record: GameRecord) => {
    setGamesMap((prev) => {
      const next = { ...prev, [record.id]: record };
      localStorage.setItem('bf:games', JSON.stringify(next));
      return next;
    });
  }, []);

  // Derived array for easy iteration in UI components
  const games = Object.values(gamesMap);

  return { gamesMap, games, saveGame };
}
