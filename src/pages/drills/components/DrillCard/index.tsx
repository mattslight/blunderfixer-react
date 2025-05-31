// src/pages/drills/components/DrillCard/index.tsx
// -------------------------
import React from 'react';
import { Chessboard } from 'react-chessboard';
import { Play } from 'lucide-react';

import { GameInfoBadges } from './GameInfoBadges';
import { HistoryDots } from './HistoryDots';
import { TimePhaseHeader } from './TimePhaseHeader';

import { PHASE_COLORS, PHASE_DISPLAY } from '@/constants/phase';
import type { DrillPosition } from '@/types';

type Props = {
  drill: DrillPosition & { history: Array<'win' | 'loss'> };
  onStartDrill: (fen: string, orientation: 'white' | 'black') => void;
};

export function DrillCard({ drill, onStartDrill }: Props) {
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
    eval_swing,
    history = ['loss', 'win'],
  } = drill;

  // Determine board orientation
  const orientation = ply % 2 === 1 ? 'black' : 'white';

  // Map API phase to display label & color
  const displayPhase = PHASE_DISPLAY[apiPhase] ?? 'Unknown';
  const phaseColor = PHASE_COLORS[displayPhase] ?? 'bg-gray-700';

  return (
    <div className="xs:grid-cols-[240px_1fr] grid gap-2 rounded-lg bg-gray-800 shadow sm:grid-cols-[360px_1fr]">
      {/* 1) Board */}
      <Chessboard
        position={fen}
        boardOrientation={orientation}
        arePiecesDraggable={false}
        customBoardStyle={{ borderRadius: '0.5rem' }}
        customDarkSquareStyle={{ backgroundColor: '#B1B7C8' }}
        customLightSquareStyle={{ backgroundColor: '#F5F2E6' }}
      />

      {/* 2) Details */}
      <div className="flex flex-col justify-between rounded p-4 tracking-wide">
        <div>
          {/* 2a) Time + Phase Header */}
          <TimePhaseHeader
            playedAt={played_at}
            displayPhase={displayPhase}
            phaseColor={phaseColor}
          />

          {/* 2b) Game Info Badges */}
          <GameInfoBadges
            timeClass={time_class}
            timeControl={time_control}
            opponent={{ username: opponent_username, rating: opponent_rating }}
            evalSwing={eval_swing}
            heroResult={hero_result}
          />
        </div>
        {/* 3 Last 5 Tries (HistoryDots) & Drill Button */}
        <div className="mt-8 flex flex-row justify-between align-bottom">
          <div>
            <div className="mb-1 text-[8pt] font-bold tracking-wide text-gray-500 uppercase">
              Last 5 Tries
            </div>
            <HistoryDots history={history} />
          </div>
          <button
            onClick={() => onStartDrill(fen, orientation)}
            className="inline-flex items-center gap-1 self-end rounded bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            <Play size={14} />
            Drill
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(DrillCard);
