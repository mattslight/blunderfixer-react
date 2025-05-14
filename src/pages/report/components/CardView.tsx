import { BlackPiece, WhitePiece } from '@/components/ChessPieces';
import { DOT_COLOR, TIME_TEXT_COLOR } from '@/lib/severity';
import { BarChart, Timer, TrendingDown, TrendingUp } from 'lucide-react';
import type { CombinedEntry } from './GameSummaryTable';

export default function CardView({
  entries,
  showAll,
  onDrill,
}: {
  entries: CombinedEntry[];
  showAll: boolean;
  onDrill?: (fen: string) => void;
}) {
  return (
    <>
      {entries.map((r, i, all) => {
        if (!showAll && r.tags.every((t) => t === 'none')) return null;
        const prev = all[i - 1];
        const prevMate = prev?.analysis.mateIn;
        const timeTag =
          r.tags.find((t) => t === 'timeImpulsive' || t === 'timeOveruse') ||
          'none';
        const timeColor = TIME_TEXT_COLOR[timeTag];
        return (
          <div
            key={i}
            className="mb-4 space-y-4 rounded-lg bg-gray-800 p-4 shadow-lg transition-transform hover:scale-102 hover:shadow-xl"
          >
            <div className="grid grid-cols-3 items-center">
              <div>
                <span className="block text-xs font-semibold tracking-wider text-green-500 uppercase">
                  Move {r.analysis.halfMoveIndex}
                </span>
              </div>
              <div className="text-center">
                <span className={`text-lg font-bold text-white`}>
                  {r.move.side === 'w' ? <WhitePiece /> : <BlackPiece />}{' '}
                  {r.move.san}
                </span>
              </div>
              <div className="text-right">
                {r.tags.map((t) =>
                  t !== 'none' ? (
                    <span
                      key={t}
                      className={`ml-1 inline-block rounded-full px-2.5 py-0.5 text-[8pt] font-semibold ${DOT_COLOR[t]} text-white`}
                    >
                      {t.toUpperCase()}
                    </span>
                  ) : null
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 items-center text-sm text-gray-300">
              <div className="flex items-center">
                <BarChart className="mr-1 text-blue-400" size={16} />
                {Math.abs(r.analysis.evalBefore) > 1000
                  ? `Mate in ${Math.abs(prevMate)}`
                  : r.analysis.evalBefore > 0
                    ? `+${r.analysis.evalBefore / 100}`
                    : r.analysis.evalBefore / 100}
              </div>
              <div
                className={`flex items-center justify-center font-medium ${r.impact < 0 ? 'text-red-500' : 'text-green-500'}`}
              >
                {Math.abs(r.impact) > 0 && (
                  <>
                    {r.impact > 0 ? (
                      <TrendingUp className="mr-1" size={16} />
                    ) : (
                      <TrendingDown className="mr-1" size={16} />
                    )}
                    {`${r.impact > 0 ? '+' : ''}${(r.impact / 100).toFixed(2)}`}
                  </>
                )}
              </div>
              <div
                className={`flex items-center justify-end font-medium ${timeColor}`}
              >
                <Timer className="mr-1" size={16} />
                {r.move.timeSpent?.toFixed(1) ?? '–'}s
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
s;
