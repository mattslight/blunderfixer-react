// src/components/GameSummary/GameSummaryTable.tsx
import type { AnalysisNode, GameRecord } from '@/types';

interface CombinedEntry {
  move: GameRecord['moves'][0];
  a: AnalysisNode;
  isBlunder: boolean;
}

interface TableProps {
  combined: CombinedEntry[];
  tacticThreshold: number;
}

export default function GameSummaryTable({
  combined,
  tacticThreshold,
}: TableProps) {
  return (
    <table className="w-full table-auto text-sm">
      <thead>
        <tr className="bg-gray-800">
          <th className="px-2 py-1 text-left">Move</th>
          <th className="px-2 py-1 text-right">Eval</th>
          <th className="px-2 py-1 text-right">Δ Eval</th>
          <th className="px-2 py-1 text-right">Time</th>
          <th className="px-2 py-1 text-right">Depth</th>
        </tr>
      </thead>
      <tbody>
        {combined.map(({ move, a, isBlunder }, i) => (
          <tr
            key={i}
            className={`border-t border-gray-700 ${isBlunder ? 'bg-red-900' : ''}`}
          >
            <td className="px-2 py-1">
              {move.moveNumber}
              {move.side}. {move.san}
            </td>
            <td className="px-2 py-1 text-right">
              {a.evalCP > 0 ? `+${a.evalCP}` : a.evalCP}
            </td>
            <td
              className={`px-2 py-1 text-right ${
                a.deltaCP <= -tacticThreshold
                  ? 'text-red-400'
                  : a.deltaCP >= tacticThreshold
                    ? 'text-green-400'
                    : ''
              }`}
            >
              {a.deltaCP > 0 ? `+${a.deltaCP}` : a.deltaCP}
            </td>
            <td className="px-2 py-1 text-right">
              {move.timeSpent != null ? `${move.timeSpent.toFixed(1)}s` : '–'}
            </td>
            <td className="px-2 py-1 text-right">{a.depth}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
