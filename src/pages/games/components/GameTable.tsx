// src/pages/games/components/GameTable.tsx
import { GameRecord } from '@/types';
import { formatTimeControl } from '../utils';

interface GameTableProps {
  games: GameRecord[];
  onAnalyse: (id: string) => void;
}

export default function GameTable({ games, onAnalyse }: GameTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse text-sm">
        <thead>
          <tr className="bg-gray-800 text-left">
            <th className="px-2 py-1">Players</th>
            <th className="px-2 py-1">Date</th>
            <th className="px-2 py-1">Result</th>
            <th className="px-2 py-1">TC</th>
            <th className="px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {games.map((g) => {
            const label = `${g.meta.players.white.player.username} vs ${g.meta.players.black.player.username}`;
            const date = new Date(g.meta.endTime * 1000).toLocaleDateString();
            const result = g.meta.pgnTags?.Result ?? '–';
            const tc = formatTimeControl(
              g.meta.timeControl + '+' + g.meta.increment
            );
            return (
              <tr key={g.id} className="border-t border-gray-700">
                <td className="px-2 py-1">{label}</td>
                <td className="px-2 py-1">{date}</td>
                <td className="px-2 py-1">{result}</td>
                <td className="px-2 py-1">{tc}</td>
                <td className="px-2 py-1">
                  <button
                    onClick={() => onAnalyse(g.id)}
                    className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                  >
                    Analyse
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
