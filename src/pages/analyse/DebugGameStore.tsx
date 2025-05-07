// src/pages/analyse/DebugGameStore.tsx
import React, { useState, useEffect } from 'react';
import GameLoader from './components/GameLoader';
import { parseChessComGame } from '@/lib/chessComParser';
import { GameRecord } from '@/types';

export default function DebugGameStore() {
  const [gamesMap, setGamesMap] = useState<Record<string, GameRecord>>({});

  // 1) Load existing bf:games from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem('bf:games');
    if (raw) {
      try {
        setGamesMap(JSON.parse(raw));
      } catch (err) {
        console.warn('Could not parse bf:games', err);
      }
    }
  }, []);

  // 2) Helper to save a single GameRecord
  const saveGame = (record: GameRecord) => {
    const next = { ...gamesMap, [record.id]: record };
    localStorage.setItem('bf:games', JSON.stringify(next));
    setGamesMap(next);
  };

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">GameStore Debug</h1>

      {/* Loader */}
      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">Load a Chess.com Game</h2>
        <GameLoader
          onSelect={(json) => {
            const record = parseChessComGame(json);
            console.log(record.moves.slice(0, 4)); // inspect first few moves
            saveGame(record);
          }}
        />
      </section>

      {/* Dump */}
      <section>
        <h2 className="mb-2 text-xl font-semibold">Stored GameRecords</h2>
        <pre className="max-h-[60vh] overflow-auto rounded bg-gray-900 p-4 text-sm">
          {JSON.stringify(gamesMap, null, 2)}
        </pre>
      </section>
    </div>
  );
}
