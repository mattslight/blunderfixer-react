import { Chessboard } from 'react-chessboard';
import { Play } from 'lucide-react';

import { HistoryDots } from './DrillCard/HistoryDots';
import { TimePhaseHeader } from './DrillCard/TimePhaseHeader';

import { PHASE_COLORS, PHASE_DISPLAY } from '@/constants/phase';
import type { DrillPosition } from '@/types';

interface Props {
  drill: DrillPosition;
  onPlay: (id: number | string) => void;
}

export default function RecentDrillRow({ drill, onPlay }: Props) {
  const {
    fen,
    ply,
    game_played_at,
    phase: apiPhase,
    hero_result,
    result_reason,
    mastered,
    history,
  } = drill;

  const orientation = ply % 2 === 1 ? 'black' : 'white';
  const displayPhase = PHASE_DISPLAY[apiPhase] ?? 'Unknown';
  const phaseColor = PHASE_COLORS[displayPhase] ?? 'bg-gray-700';

  const resultLabel =
    hero_result === 'win' ? 'Win' : hero_result === 'loss' ? 'Loss' : 'Draw';
  const resultColor =
    hero_result === 'win'
      ? 'bg-green-500'
      : hero_result === 'loss'
        ? 'bg-red-600'
        : 'bg-gray-600';

  const reason = result_reason
    ?.replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <li className="grid grid-cols-[120px_1fr_auto] items-center gap-3 rounded-lg bg-gray-800 p-3 text-white">
      {/* Board */}
      <div>
        <Chessboard
          position={fen}
          boardOrientation={orientation}
          arePiecesDraggable={false}
          boardWidth={120}
          customBoardStyle={{ borderRadius: '0.5rem' }}
          customDarkSquareStyle={{ backgroundColor: '#B1B7C8' }}
          customLightSquareStyle={{ backgroundColor: '#F5F2E6' }}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between space-y-1 overflow-hidden text-sm">
        <TimePhaseHeader
          playedAt={game_played_at}
          displayPhase={displayPhase}
          phaseColor={phaseColor}
        />

        <div className="flex items-center gap-2 text-xs">
          <span className={`rounded px-2 py-0.5 text-white ${resultColor}`}>
            {resultLabel}
          </span>
          {reason && <span className="truncate text-gray-300">{reason}</span>}
          {mastered && (
            <span className="text-xs font-semibold text-green-400 uppercase">
              Mastered
            </span>
          )}
        </div>

        <HistoryDots history={history} />
      </div>

      {/* Action */}
      <div className="flex h-full items-end">
        <button
          onClick={() => onPlay(drill.id)}
          className="inline-flex items-center gap-1 rounded bg-green-600 px-3 py-1 text-sm font-semibold text-white hover:bg-green-700"
        >
          <Play size={14} />
          Drill
        </button>
      </div>
    </li>
  );
}
