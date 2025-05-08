// src/pages/games/index.tsx
import { useState, useEffect } from 'react';
import { GameRecord } from '@/types';
import UsernameInput from './components/UsernameInput';

type ItemType = 'game' | 'pgn' | 'fen';
type Status = 'pending' | 'analysing' | 'done';

interface BaseItem {
  id: string;
  type: ItemType;
  label: string;
  status: Status;
}

interface GameItem extends BaseItem {
  type: 'game';
  game: GameRecord;
}

interface PGNItem extends BaseItem {
  type: 'pgn';
  pgn: string;
}

interface FENItem extends BaseItem {
  type: 'fen';
  fen: string;
}

type AnalysisItem = GameItem | PGNItem | FENItem;

export default function GamesHistoryPage() {
  function onSelectPGN(pgn) {
    console.log('pgn from loader selected', pgn);
  }
  return (
    <div className="2xl:ml-12">
      <div className="max-w-lg">
        <UsernameInput />
      </div>
      <AnalysisTable />
    </div>
  );
}

function AnalysisTable() {
  const [items, setItems] = useState<AnalysisItem[]>([]);

  // 1) Load from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem('bf:games');
    if (raw) {
      const gamesMap: Record<string, GameRecord> = JSON.parse(raw);
      const games = Object.values(gamesMap).map<GameItem>((g) => ({
        id: g.id,
        type: 'game',
        label: `${g.meta.players.white.player.username} vs ${g.meta.players.black.player.username}`,
        status: 'done',
        game: g,
      }));
      setItems((prev) => [...games, ...prev.filter((i) => i.type !== 'game')]);
    }
  }, []);

  // 6) Formatters

  function formatTimeControl(tc: string) {
    const parts = tc.split('+').map((n) => parseInt(n, 10));
    const init = parts[0] || 0;
    const inc = parts[1] || 0;
    const m = Math.floor(init / 60);
    const s = init % 60;
    let str = m ? `${m}m` : '';
    if (s) str += ` ${s}s`;
    if (inc) str += ` +${inc}s`;
    return str.trim();
  }

  // 7) Render

  return (
    <div className="mr-4 2xl:ml-12">
      <table className="w-full table-auto border-collapse text-sm">
        <thead>
          <tr className="bg-gray-800 text-left">
            <th className="px-2 py-1">Game</th>
            <th className="px-2 py-1">Date / Site</th>
            <th className="px-2 py-1">Result</th>
            <th className="px-2 py-1">Time-Ctr</th>
            <th className="px-2 py-1">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            let dateSite = '—';
            let result = '—';
            let tc = '—';
            if (item.type === 'game') {
              const g = (item as GameItem).game;
              dateSite = `${new Date(g.meta.endTime * 1000).toLocaleDateString()} • Chess.com`;
              result = g.meta.pgnTags?.Result || '—';
              tc = `${formatTimeControl(g.meta.timeControl + '+' + g.meta.increment)} ${g.meta.timeClass}`;
            }
            if (item.type === 'pgn') {
              dateSite = '—';
              result = '—';
              tc = '—';
            }
            if (item.type === 'fen') {
              dateSite = '—';
              result = '—';
              tc = '—';
            }

            return (
              <tr key={item.id} className="border-t border-gray-700">
                <td className="px-2 py-1">{item.label}</td>
                <td className="px-2 py-1">{dateSite}</td>
                <td className="px-2 py-1">{result}</td>
                <td className="px-2 py-1">{tc}</td>
                <td className="px-2 py-1">load summary</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
