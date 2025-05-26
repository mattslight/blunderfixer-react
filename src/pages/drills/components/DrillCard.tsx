// src/pages/drills/components/DrillCard.tsx
import type { DrillPosition } from '@/types';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Clock, Play, User } from 'lucide-react';
import React from 'react';
import { Chessboard } from 'react-chessboard';

const PHASE_COLORS: Record<string, string> = {
  Opening: 'bg-blue-700',
  Middlegame: 'bg-purple-700',
  Endgame: 'bg-rose-700',
};

const RESULT_COLOUR: Record<string, string> = {
  win: 'border-green-600',
  loss: 'border-red-600',
  draw: 'border-gray-600',
};

function formatTimeControl(tc: string): string {
  const [base, inc] = tc.split('+');
  const minutes = Number(base) / 60;
  // if it’s a whole number, show “3” not “3.0”
  const baseStr = Number.isInteger(minutes) ? `${minutes}` : minutes.toFixed(1);
  return inc
    ? `${baseStr}m+${inc}` // e.g. “3+2”
    : `${baseStr}min`; // e.g. “10min”
}

function DrillCard({
  drill,
  onStartDrill,
}: {
  drill: DrillPosition;
  onStartDrill: (fen: string) => void;
}) {
  const {
    fen,
    ply,
    played_at,
    time_class,
    time_control,
    hero_result,
    opponent_username,
    opponent_rating,
  } = drill;

  const phase = ply <= 20 ? 'Opening' : ply <= 50 ? 'Middlegame' : 'Endgame';

  const dt = parseISO(played_at);
  console.log('played_at →', played_at);
  console.log('parsed ISO →', dt.toString(), '/', dt.toISOString());
  console.log('offset mins →', dt.getTimezoneOffset());

  return (
    <div className="grid grid-cols-[200px_1fr] gap-2 rounded-lg bg-gray-800 shadow">
      {/* Board */}
      <Chessboard
        position={fen}
        boardOrientation={ply % 2 === 1 ? 'black' : 'white'}
        boardWidth={200}
        arePiecesDraggable={false}
        customBoardStyle={{ borderRadius: '0.5rem' }}
      />

      {/* Details */}
      <div
        className={`flex flex-col justify-between rounded border-r-4 p-4 tracking-wide ${RESULT_COLOUR[hero_result]}`}
      >
        {/* Top row: when drilled & when played */}
        <div>
          <div className="flex justify-between text-xs text-gray-400">
            <time dateTime={played_at}>
              <Clock className="relative bottom-0.25 mr-1 inline h-3 w-3" />
              {formatDistanceToNow(parseISO(played_at), {
                addSuffix: true,
              }).replace(/^about\s*/, '')}
            </time>
            <span
              className={`rounded px-2 py-0.5 text-xs font-semibold text-gray-300 ${PHASE_COLORS[phase]}`}
            >
              {phase}
            </span>
          </div>
          {/* Middle row: game info */}
          <div className="mt-4 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-400 capitalize">
                {time_class}
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-400">
                {formatTimeControl(time_control)}
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-400">
                <User className="h-3 w-3" />
                {opponent_username}&nbsp;({opponent_rating})
              </span>
            </div>
          </div>
        </div>

        {/* Play button */}
        <button
          onClick={() => onStartDrill(fen)}
          className="mt-4 inline-flex items-center gap-1 self-end rounded bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          <Play size={14} />
          Drill
        </button>
      </div>
    </div>
  );
}

export default React.memo(DrillCard);
