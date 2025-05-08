// src/pages/games/components/AnalysisTable.tsx
import { GameRecord } from '@/types';
import { formatTimeControl } from '../utils';

interface AnalysisTableProps {
  games: GameRecord[];
}

export default function AnalysisTable({ games }: AnalysisTableProps) {
  return (
    <div className="mr-4 2xl:ml-12">
      <table className="w-full table-auto border-collapse text-sm">
        <thead>
          <tr className="bg-gray-800 text-left">
            <th className="px-2 py-1">Game</th>
            <th className="px-2 py-1">Date / Site</th>
            <th className="px-2 py-1">Result</th>
            <th className="px-2 py-1">Time-Ctr</th>
          </tr>
        </thead>
        <tbody>
          {games.map((g) => {
            const label = `${g.meta.players.white.player.username} vs ${g.meta.players.black.player.username}`;
            const dateSite = `${new Date(g.meta.endTime * 1000).toLocaleDateString()} • Chess.com`;
            const result = g.meta.pgnTags?.Result ?? '—';
            const tc = `${formatTimeControl(g.meta.timeControl + '+' + g.meta.increment)} ${g.meta.timeClass}`;

            return (
              <tr key={g.id} className="border-t border-gray-700">
                <td className="px-2 py-1">{label}</td>
                <td className="px-2 py-1">{dateSite}</td>
                <td className="px-2 py-1">{result}</td>
                <td className="px-2 py-1">{tc}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
