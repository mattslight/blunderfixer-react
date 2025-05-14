// src/pages/report/components/CardView.tsx
import { BlackPiece, WhitePiece } from '@/components/ChessPieces';
import { DOT_COLOR, TIME_TEXT_COLOR } from '@/lib/severity';
import { Square } from 'chess.js';
import {
  ArrowUpRight,
  BarChart,
  ChevronDown,
  ChevronUp,
  Timer,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import { Chessboard } from 'react-chessboard';
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
  const [expanded, setExpanded] = useState<number | null>(null);

  const prevValid = (i: number) => i > 0;
  const nextValid = (i: number) => i < entries.length - 1;

  return (
    <>
      {entries.map((r, i, all) => {
        if (!showAll && r.tags.every((t) => t === 'none')) return null;
        const isOpen = expanded === i;
        const toggle = () => setExpanded(isOpen ? null : i);
        const stop = (e: React.MouseEvent) => e.stopPropagation();
        const prev = all[i - 1];
        const prevMate = prev?.analysis.mateIn;

        const primaryTag = r.tags[0];
        const timeTag =
          r.tags.find((t) => t === 'timeImpulsive' || t === 'timeOveruse') ||
          'none';
        const timeColor = TIME_TEXT_COLOR[timeTag];

        const customArrows: [Square, Square][] =
          r.move.from && r.move.to
            ? [[r.move.from as Square, r.move.to as Square]]
            : [];

        return (
          <div
            key={i}
            className="mb-4 overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-shadow hover:shadow-xl"
          >
            {/* HEADER */}
            <div
              onClick={toggle}
              className="relative cursor-pointer transition-colors hover:bg-gray-700"
            >
              <div className="grid grid-cols-3 items-center p-4">
                {/* move number */}
                <div>
                  <span className="text-xs font-semibold text-green-500 uppercase">
                    Move {r.analysis.halfMoveIndex}
                  </span>
                </div>
                {/* piece + SAN centered */}
                <div className="justify-self-center text-center">
                  <span className="text-lg font-bold text-white">
                    {r.move.side === 'w' ? <WhitePiece /> : <BlackPiece />}{' '}
                    <span className="ml-2">{r.move.san}</span>
                  </span>
                </div>
                {/* severity tag + caret */}
                <div className="flex items-center space-x-1 justify-self-end">
                  {primaryTag !== 'none' && (
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[8pt] font-semibold ${DOT_COLOR[primaryTag]} text-white`}
                    >
                      {primaryTag.toUpperCase()}
                    </span>
                  )}
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* METRICS */}
              <div className="grid grid-cols-3 gap-4 px-4 pb-4 text-sm text-gray-300">
                <div className="flex items-center">
                  <BarChart className="mr-1 text-blue-400" size={16} />
                  {Math.abs(r.analysis.evalBefore) > 1000
                    ? `Mate in ${Math.abs(prevMate)}`
                    : r.analysis.evalBefore > 0
                      ? `+${r.analysis.evalBefore / 100}`
                      : r.analysis.evalBefore / 100}
                </div>
                <div
                  className={`flex items-center justify-center font-medium ${
                    r.impact < 0 ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {Math.abs(r.impact) > 0 && (
                    <>
                      {r.impact > 0 ? (
                        <TrendingUp className="mr-1" size={16} />
                      ) : (
                        <TrendingDown className="mr-1" size={16} />
                      )}
                      {`${r.impact > 0 ? '+' : ''}${(r.impact / 100).toFixed(
                        2
                      )}`}
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

            {/* EXPANDED PANEL */}
            {isOpen && (
              <div className="flex flex-col items-center border-t border-gray-700 px-4 pb-4">
                <div className="mt-4">
                  <Chessboard
                    position={r.analysis.fenBefore}
                    customArrows={customArrows}
                    boardWidth={320}
                    customArrowColor="#48AD7E"
                    customBoardStyle={{
                      borderRadius: '0.5em',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                    }}
                    customDarkSquareStyle={{
                      backgroundColor: 'rgb(157,163,180)',
                    }}
                    customLightSquareStyle={{
                      backgroundColor: 'rgb(245,242,230)',
                      mixBlendMode: 'multiply',
                    }}
                  />
                </div>
                <div className="mt-4 flex justify-center">
                  <button
                    className="items-center rounded bg-purple-500 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-600"
                    onClick={(e) => {
                      stop(e);
                      onDrill?.(r.analysis.fenBefore);
                    }}
                  >
                    Discuss with coach
                    <ArrowUpRight className="mb-[1px] ml-1 inline-flex h-3 w-3" />
                  </button>
                </div>

                <div className="mt-2 flex w-full max-w-xs justify-between">
                  <button
                    className="px-3 py-1 text-sm font-medium text-white disabled:opacity-50"
                    disabled={!prevValid(i)}
                    onClick={(e) => {
                      stop(e);
                      setExpanded(i - 1);
                    }}
                  >
                    ← Prev
                  </button>
                  <button
                    className="px-3 py-1 text-sm font-medium text-white disabled:opacity-50"
                    disabled={!nextValid(i)}
                    onClick={(e) => {
                      stop(e);
                      setExpanded(i + 1);
                    }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
