import { BlackPiece, WhitePiece } from '@/components/ChessPieces';
import { DOT_COLOR, TIME_TEXT_COLOR } from '@/lib/severity';
import type { CombinedEntry } from './SummaryTable';

export default function TableView({
  entries,
  showAll,
  onClick,
}: {
  entries: CombinedEntry[];
  showAll: boolean;
  onClick: (halfMoveIndex: number) => void;

  // how do I get the pgn here?
}) {
  return (
    <table className="mt-4 w-full table-auto text-sm">
      <thead>
        <tr className="bg-gray-800">
          <th className="px-2 py-1" />
          <th className="px-2 py-1 text-left">Move</th>
          <th className="px-2 py-1" />
          <th className="px-2 py-1 text-left" />
          <th className="px-2 py-1 text-right">Impact</th>
          <th className="px-2 py-1 text-right">
            Time <span className="font-normal text-gray-400">(s)</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {entries.map((r, idx) => {
          if (!showAll && r.tags.every((t) => t === 'none')) return null;
          const timeTag =
            r.tags.find((t) => t === 'timeImpulsive' || t === 'timeOveruse') ||
            'none';
          return (
            <tr
              key={idx}
              className="border-t border-gray-800 hover:bg-gray-700"
              onClick={() => onClick(r.analysis.halfMoveIndex)}
            >
              <td className="px-2 py-1 text-center">
                {r.tags.map((t) =>
                  t !== 'none' ? (
                    <span
                      key={t}
                      className={`inline-block h-3 w-3 rounded-full ${DOT_COLOR[t]} mr-1`}
                    />
                  ) : null
                )}
              </td>
              <td className="px-2 py-1 text-gray-500">
                {r.analysis.halfMoveIndex}.
              </td>
              <td className="px-2 py-1">
                {r.move.side === 'w' ? <WhitePiece /> : <BlackPiece />}
              </td>
              <td className="px-2 py-1 text-white">{r.move.san}</td>
              <td
                className={`px-2 py-1 text-right font-medium ${r.impact < 0 ? 'text-red-500' : 'text-green-500'}`}
              >
                {`${r.impact > 0 ? '+' : ''}${(r.impact / 100).toFixed(2)}`}
              </td>
              <td
                className={`px-2 py-1 text-right font-medium ${TIME_TEXT_COLOR[timeTag]}`}
              >
                {r.move.timeSpent?.toFixed(1) ?? '–'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
