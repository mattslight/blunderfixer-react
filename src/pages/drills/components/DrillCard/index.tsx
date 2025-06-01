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
  drill: DrillPosition;
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
    <div
      className="xs:grid-cols-[240px_1fr] xs:gap-0 grid rounded-lg bg-gray-800 shadow sm:grid-cols-[360px_1fr]"
      onClick={() => onStartDrill(fen, orientation)}
    >
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
      <div className="xs:p-4 flex flex-col justify-between rounded p-6 tracking-wide sm:p-6">
        <div className="flex flex-col gap-2">
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
        <div className="xs:rounded-bl-none xs:p-4 xs:-m-4 -m-6 mt-8 flex flex-row justify-between rounded-br-xl rounded-bl-xl bg-white/5 p-6 align-bottom sm:-m-6 sm:p-6">
          <div>
            <div className="xs:text-xs mb-2 text-sm font-bold text-green-400 uppercase sm:text-xs">
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
