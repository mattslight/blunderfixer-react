// src/pages/report/components/CardView.tsx
import { BlackPiece, WhitePiece } from '@/components/ChessPieces';
import { DOT_COLOR, TIME_TEXT_COLOR } from '@/lib/severity';
import { Square } from 'chess.js';
import {
  BarChart,
  MessagesSquare,
  Timer,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useLayoutEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import type { CombinedEntry } from './SummaryTable';

interface CardViewProps {
  entry: CombinedEntry;
  onDrill?: (pgn: string, halfMoveIndex: number) => void;
  pgn: string;
  heroSide: 'w' | 'b';
}

export default function CardView({
  entry: r,
  onDrill,
  pgn,
  heroSide,
}: CardViewProps) {
  // derive visual elements
  const primaryTag = r.tags[0];
  const timeTag =
    r.tags.find((t) => t === 'timeImpulsive' || t === 'timeOveruse') || 'none';
  const timeColor = TIME_TEXT_COLOR[timeTag];

  const customArrows: [Square, Square][] =
    r.move.from && r.move.to
      ? [[r.move.from as Square, r.move.to as Square]]
      : [];

  // find previous mate for evalBefore display
  // assume prev is provided via parent if needed; else omit mate label
  const mateLabel = r.analysis.mateIn
    ? `Mate in ${Math.abs(r.analysis.mateIn)}`
    : null;

  // use layout effect to ensure chessboard is rendered before measuring
  const [boardWidth, setBoardWidth] = useState(400);

  // 2️⃣ Layout effect to measure and respond to resizes
  useLayoutEffect(() => {
    function updateBoardWidth() {
      const w = window.innerWidth;
      if (w < 440) setBoardWidth(window.innerWidth - 40);
      else setBoardWidth(400);
    }

    // run on mount
    updateBoardWidth();

    // listen to window resize
    window.addEventListener('resize', updateBoardWidth);
    return () => {
      window.removeEventListener('resize', updateBoardWidth);
    };
  }, []);

  return (
    <div className="mb-4 overflow-hidden rounded-lg bg-gray-800 shadow-lg">
      {/* HEADER */}
      <div className="grid grid-cols-3 items-center bg-gray-700 p-4">
        <div>
          <span className="text-xs font-semibold text-green-500 uppercase">
            Move {r.analysis.halfMoveIndex}
          </span>
        </div>
        <div className="justify-self-center text-center">
          <span className="flex items-center text-lg font-bold text-white">
            {r.move.side === 'w' ? <WhitePiece /> : <BlackPiece />}
            <span className="ml-2">{r.move.san}</span>
          </span>
        </div>
        <div className="flex items-center space-x-1 justify-self-end">
          {primaryTag !== 'none' && (
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-[8pt] font-semibold ${DOT_COLOR[primaryTag]} text-white`}
            >
              {primaryTag.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-3 gap-4 bg-gray-700 px-4 pb-4 text-sm text-gray-300">
        <div className="flex items-center">
          <BarChart className="mr-1 text-blue-400" size={16} />
          {mateLabel ||
            (r.analysis.evalBefore > 0
              ? `+${r.analysis.evalBefore / 100}`
              : `${r.analysis.evalBefore / 100}`)}
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

      {/* BOARD */}
      <div className="space-y-4 bg-gray-800">
        <div className="pb- flex flex-row items-center border-gray-700">
          <div className="mx-auto my-4">
            <Chessboard
              boardOrientation={heroSide === 'b' ? 'black' : 'white'}
              position={r.analysis.fenBefore}
              arePiecesDraggable={false}
              onPieceDrop={() => false}
              onSquareClick={() => {}}
              customArrows={customArrows}
              boardWidth={boardWidth || 400}
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
        </div>

        <div className="my-4 flex justify-center">
          <button
            className="items-center rounded-md border-b-2 border-b-purple-900 bg-purple-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-600"
            onClick={() => onDrill?.(pgn, r.analysis.halfMoveIndex)}
          >
            <MessagesSquare className="mr-2 mb-[1px] inline-flex h-4 w-4" />
            Discuss with coach
          </button>
        </div>
      </div>
    </div>
  );
}
