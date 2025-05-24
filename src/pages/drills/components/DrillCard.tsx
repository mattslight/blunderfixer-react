// src/components/DrillCard.tsx
import type { DrillPosition } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Play } from 'lucide-react';
import { Chessboard } from 'react-chessboard';

const PHASE_COLORS: Record<string, string> = {
  Opening: 'bg-blue-700',
  Middlegame: 'bg-purple-700',
  Endgame: 'bg-rose-700',
};

export default function DrillCard({
  drill,
  onStartDrill,
}: {
  drill: DrillPosition & {
    game_class: string; // "bullet"|"blitz"|"rapid"|"classical"
    time_control: string; // e.g. "10+2"
  };
  onStartDrill: (fen: string) => void;
}) {
  const {
    fen,
    ply,
    created_at,
    opponent = '—',
    result = '—',
    blunder_type,
    game_class,
    time_control,
  } = drill;

  const moveNum = Math.ceil(ply / 2);
  const side = ply % 2 === 0 ? 'Black' : 'White';
  const phase =
    moveNum <= 14 ? 'Opening' : moveNum <= 30 ? 'Middlegame' : 'Endgame';

  // mock until real API supplies it:
  const motif = 'missed_fork';
  const motifLabel = motif
    .split('_')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <div className="grid grid-cols-[200px_1fr] gap-4 rounded-lg bg-gray-800 shadow hover:shadow-lg">
      {/* BOARD */}
      <div className="self-center">
        <Chessboard
          boardOrientation={side.toLowerCase() as 'white' | 'black'}
          position={fen}
          boardWidth={200}
          arePiecesDraggable={false}
          customBoardStyle={{
            borderRadius: '0.5rem',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
        />
      </div>

      {/* DETAILS */}
      <div className="flex flex-col justify-between p-4">
        {/* TOP ROW: time, class, control, phase, type, motif, move */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-gray-500">
            <time className="text-xs whitespace-nowrap" dateTime={created_at}>
              <Clock className="mr-1 inline-flex h-3 w-3 flex-shrink-0" />
              {formatDistanceToNow(new Date(created_at))} ago
            </time>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-gray-400`}
              >
                {game_class || 'Blitz'}
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-gray-400">
                {time_control || '3+2'}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-gray-500">
            <span className="inline-flex items-center rounded-full bg-yellow-200 px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-gray-700">
              {motifLabel}
            </span>
            <span
              className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-white ${PHASE_COLORS[phase]} `}
            >
              {phase}
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm whitespace-nowrap text-gray-300">
            vs {opponent} • {result}
          </span>
          <button
            onClick={() => onStartDrill(fen)}
            className="flex items-center space-x-1 rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            Play <Play className="ml-2" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
