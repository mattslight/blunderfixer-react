// src/pages/drills/components/DrillCard/index.tsx
// -------------------------
import React from 'react';
import { Chessboard } from 'react-chessboard';
import { Play } from 'lucide-react';

import { GameInfoBadges } from './GameInfoBadges';
import { HistoryDots } from './HistoryDots';
import { TimePhaseHeader } from './TimePhaseHeader';

import { PHASE_COLORS, PHASE_DISPLAY } from '@/const/phase';
import useBreakpoint from '@/hooks/useBreakpoint';
import type { DrillPosition } from '@/types';

type Props = {
  drill: DrillPosition;
  onStartDrill: (id: number | string) => void;
};

const DEBUG = false; // Set to true for debugging output

export function DrillCard({ drill, onStartDrill }: Props) {
  const {
    fen,
    ply,
    game_played_at,
    time_class,
    time_control,
    hero_result,
    opponent_username,
    opponent_rating,
    phase: apiPhase,
    eval_swing,
    history,
  } = drill;

  // Determine board orientation
  const orientation = ply % 2 === 1 ? 'black' : 'white';

  // Map API phase to display label & color
  const displayPhase = PHASE_DISPLAY[apiPhase] ?? 'Unknown';
  const phaseColor = PHASE_COLORS[displayPhase] ?? 'bg-stone-700';

  const { current, isAtLeast, screenWidth } = useBreakpoint();

  const boardWidth = isAtLeast('sm')
    ? 360
    : current === 'xs'
      ? 360
      : screenWidth - 32;

  if (DEBUG) console.debug('[useBreakpoint] ', current);

  return (
    <div
      className="grid rounded-lg bg-stone-800 shadow sm:grid-cols-[360px_1fr]"
      onClick={() => onStartDrill(drill.id)}
    >
      {/* 1) Board */}
      <div className="shrink-0">
        <Chessboard
          position={fen}
          boardOrientation={orientation}
          arePiecesDraggable={false}
          boardWidth={boardWidth}
          customBoardStyle={{ borderRadius: '0.5rem' }}
          customDarkSquareStyle={{ backgroundColor: '#B1B7C8' }}
          customLightSquareStyle={{ backgroundColor: '#F5F2E6' }}
        />
      </div>

      {/* 2) Details */}
      <div className="flex flex-col justify-between rounded px-4 py-6 tracking-wide">
        <div className="flex flex-col gap-2">
          {/* 2a) Time + Phase Header */}
          <TimePhaseHeader
            playedAt={game_played_at}
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
            eco={drill.eco}
            ecoUrl={drill.eco_url}
          />
        </div>
        {/* 3 Last 5 Tries (HistoryDots) & Drill Button */}
        <div className="xs:rounded-bl-none -mx-4 -my-6 mt-6 flex flex-row justify-between rounded-br-xl rounded-bl-xl bg-white/5 px-4 py-4 align-bottom">
          <div className="mr-6">
            <div className="xs:text-xs mb-2 text-sm font-bold text-green-400 uppercase sm:text-xs">
              Last 5 Tries
            </div>
            <HistoryDots history={history} />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={() => onStartDrill(drill.id)}
              className="inline-flex items-center gap-1 rounded bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              <Play size={14} />
              Drill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(DrillCard);
