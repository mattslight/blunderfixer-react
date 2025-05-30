import type { DrillPosition } from '@/types';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Clock, Play, User } from 'lucide-react';
import React from 'react';
import { Chessboard } from 'react-chessboard';

// Map API phase values to display labels and colors
const PHASE_DISPLAY: Record<string, string> = {
  opening: 'Opening',
  middle: 'Middle',
  late: 'Late',
  endgame: 'Endgame',
};
const PHASE_COLORS: Record<string, string> = {
  Opening: 'bg-blue-700',
  Middle: 'bg-purple-700',
  Late: 'bg-fuchsia-700',
  Endgame: 'bg-rose-700',
};

function formatTimeControl(tc: string): string {
  const [base, inc] = tc.split('+');
  const minutes = Number(base) / 60;
  const baseStr = Number.isInteger(minutes) ? `${minutes}` : minutes.toFixed(1);
  return inc ? `${baseStr}m+${inc}` : `${baseStr}min`;
}

function DrillCard({
  drill,
  onStartDrill,
}: {
  drill: DrillPosition;
  onStartDrill: (fen: string, orientation: 'white' | 'black') => void;
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
    phase: apiPhase,
  } = drill;

  // Determine board orientation based on ply
  const orientation = ply % 2 === 1 ? 'black' : 'white';

  // Map API phase to display label and color
  const displayPhase = PHASE_DISPLAY[apiPhase] ?? 'Unknown';
  const phaseColor = PHASE_COLORS[displayPhase] ?? 'bg-gray-700';

  return (
    <div
      className={`xs:grid-cols-[200px_1fr] grid gap-2 rounded-lg bg-gray-800 shadow`}
    >
      {/* Board */}
      <Chessboard
        position={fen}
        boardOrientation={orientation}
        arePiecesDraggable={false}
        customBoardStyle={{ borderRadius: '0.5rem' }}
        customDarkSquareStyle={{ backgroundColor: '#B1B7C8' }}
        customLightSquareStyle={{ backgroundColor: '#F5F2E6' }}
      />

      {/* Details */}
      <div
        className={`flex flex-col justify-between rounded p-4 tracking-wide`}
      >
        {/* Top row */}
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <time dateTime={played_at}>
              <Clock className="relative bottom-0.25 mr-1 inline h-3 w-3" />
              {formatDistanceToNow(parseISO(played_at), {
                addSuffix: true,
              }).replace(/^about\s*/, '')}
            </time>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold text-gray-300 ${phaseColor}`}
            >
              {displayPhase}
            </span>
          </div>
          {/* Game info */}
          <div className="mt-4 flex items-center gap-2 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-400 capitalize">
                {time_class}
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-400">
                {formatTimeControl(time_control)}
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-400">
                <User className="h-3 w-3" />
                <p className="line-clamp-1">
                  {opponent_username}&nbsp;({opponent_rating})
                </p>
              </span>
            </div>
          </div>
        </div>

        {/* Play button */}
        <button
          onClick={() => onStartDrill(fen, orientation)}
          className="mt-4 inline-flex items-center gap-1 self-end rounded bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          <Play size={14} />
          Drill
        </button>
      </div>
    </div>
  );
}

export default React.memo(DrillCard);
