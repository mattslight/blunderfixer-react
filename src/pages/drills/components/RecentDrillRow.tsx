import { Chessboard } from 'react-chessboard';
import { Play } from 'lucide-react';

import { GameInfoBadges } from './DrillCard/GameInfoBadges';
import { HistoryDots } from './DrillCard/HistoryDots';

      <div className="shrink-0">
        <Chessboard
          position={drill.fen}
          boardOrientation={orientation}
          arePiecesDraggable={false}
          boardWidth={120}
          customBoardStyle={{ borderRadius: '0.5rem' }}
          customDarkSquareStyle={{ backgroundColor: '#B1B7C8' }}
          customLightSquareStyle={{ backgroundColor: '#F5F2E6' }}
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 overflow-hidden">
        <div className="flex items-baseline justify-between">
          <span className={`text-sm font-semibold ${resultColor}`}>
            {resultLabel}
          {dateStr && (
            <time className="text-xs text-gray-400" dateTime={absolute}>
              {dateStr}
            </time>
        <GameInfoBadges
          timeClass={drill.time_class}
          timeControl={drill.time_control}
          opponent={{
            username: drill.opponent_username,
            rating: drill.opponent_rating,
          }}
          evalSwing={drill.eval_swing}
          heroResult={drill.hero_result}
        />
        <HistoryDots history={drill.history} />
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
