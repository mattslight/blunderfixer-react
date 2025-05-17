import { BlackPiece, WhitePiece } from '@/components/ChessPieces';
import {
  DOT_COLOR,
  getErrorSeverity,
  getTimeRemainingClass,
  TEXT_SEVERITY_COLOR,
  TIME_TEXT_COLOR,
} from '@/lib/severity';
import { Clock, TimerReset } from 'lucide-react';
import type { CombinedEntry } from './SummaryTable';

export default function TableView({
  entries,
  showAll,
  onClick,
  timeControl,
}: {
  entries: CombinedEntry[];
  showAll: boolean;
  onClick: (halfMoveIndex: number) => void;
  timeControl?: number;

  // how do I get the pgn here?
}) {
  return (
    <table className="mt-4 w-full table-auto text-sm">
      <thead>
        <tr className="bg-gray-800">
          <th className="px-2 py-1" />
          <th colSpan={3} className="px-2 py-1 text-center align-bottom">
            Move
          </th>
          <th className="px-2 py-1 text-right align-bottom">Score Impact</th>
          <th className="px-2 py-1 text-right align-bottom">
            <Clock size={12} className="inline" />
            <span className="ml-1">Remaining</span>
          </th>
          <th className="px-2 py-1 text-right align-bottom">
            <TimerReset size={12} className="inline" />
            <span className="ml-1">Spent</span>
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
              <td className="px-2 py-1 text-right text-gray-500">
                {r.analysis.halfMoveIndex}.
              </td>
              <td className="pl-5">
                {r.move.side === 'w' ? <WhitePiece /> : <BlackPiece />}
              </td>
              <td className="px-2 py-1 text-white">{r.move.san}</td>
              <td
                className={`px-2 py-1 text-right font-medium ${
                  r.impact < 0
                    ? TEXT_SEVERITY_COLOR[getErrorSeverity(r.impact)]
                    : r.impact > 50
                      ? 'text-green-500'
                      : 'text-gray-600'
                }`}
              >
                {`${r.impact > 0 ? '+' : ''}${(r.impact / 100).toFixed(2)}`}
              </td>
              <td
                className={`font-medium} px-2 py-1 text-right ${getTimeRemainingClass(
                  r.move.secondsRemaining ?? 0,
                  timeControl
                )}`}
              >
                {r.move.secondsRemaining?.toFixed(1) ?? '–'}{' '}
                <span className="text-gray-600">s</span>
              </td>
              <td
                className={`px-2 py-1 text-right font-medium ${TIME_TEXT_COLOR[timeTag]}`}
              >
                {r.move.timeSpent?.toFixed(1) ?? '–'}{' '}
                <span className="text-gray-600">s</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
