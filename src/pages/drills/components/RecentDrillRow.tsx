import { Chessboard } from 'react-chessboard';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { Play } from 'lucide-react';

import { GameInfoBadges } from './DrillCard/GameInfoBadges';
import { HistoryDots } from './DrillCard/HistoryDots';

import useBreakpoint from '@/hooks/useBreakpoint';
import type { DrillPosition } from '@/types';

interface Props {
  drill: DrillPosition;
  onPlay: (id: number | string) => void;
}

export default function RecentDrillRow({ drill, onPlay }: Props) {
  const orientation = drill.ply % 2 === 1 ? 'black' : 'white';

  const last = [...drill.history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];

  const resultLabel = last ? (
    last.result === 'pass' ? (
      'Passed'
    ) : (
      'Failed'
    )
  ) : (
    <i>Skipped</i>
  );
  // const resultColor = last
  //   ? last.result === 'pass'
  //     ? 'text-green-400'
  //     : 'text-red-500'
  //   : 'text-stone-400';

  const drilledDate = drill.last_drilled_at
    ? parseISO(drill.last_drilled_at)
    : null;
  const dateStr = drilledDate
    ? formatDistanceToNow(drilledDate, { addSuffix: true }).replace(
        /^about\s*/,
        ''
      )
    : '';
  const absolute = drilledDate ? format(drilledDate, 'yyyy-MM-dd HH:mm') : '';

  const { isAtLeast } = useBreakpoint();

  const isDesktop = isAtLeast('sm');

  return (
    <li
      className="flex items-center gap-2 rounded-lg bg-stone-800"
      onClick={() => onPlay(drill.id)}
    >
      <div className="shrink-0">
        <Chessboard
          position={drill.fen}
          boardOrientation={orientation}
          arePiecesDraggable={false}
          boardWidth={160}
          customBoardStyle={{ borderRadius: '0.5rem' }}
          customDarkSquareStyle={{ backgroundColor: '#B1B7C8' }}
          customLightSquareStyle={{ backgroundColor: '#F5F2E6' }}
        />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden p-2 sm:p-4">
        <div className="flex flex-col items-baseline justify-between sm:flex-row">
          <span className={`text-sm`}>
            <div className="mt-2 text-xs font-bold text-green-400 uppercase sm:text-xs">
              Last Attempt
            </div>
            {resultLabel} – <i>{drill.history.at(-1)?.reason}</i>
          </span>
          {dateStr && (
            <time className="text-xs text-stone-400" dateTime={absolute}>
              {dateStr}
            </time>
          )}
        </div>
        <GameInfoBadges
          timeClass={drill.time_class}
          timeControl={drill.time_control}
          opponent={{
            username: drill.opponent_username,
            rating: drill.opponent_rating,
          }}
          evalSwing={drill.eval_swing}
          heroResult={drill.hero_result}
          eco={drill.eco}
          ecoUrl={drill.eco_url}
          hideGameResult={!isDesktop}
          hideOpponentRating={!isDesktop}
        />
        <div className="mt-2 text-xs font-bold text-stone-400 uppercase sm:text-xs">
          Last 5 Tries
        </div>
        <div className="flex items-center justify-between">
          <HistoryDots history={drill.history} />
          <button
            onClick={() => onPlay(drill.id)}
            className="xs:inline-flex ml-2 hidden items-center gap-1 rounded bg-green-600 px-2 py-1 text-sm text-white hover:bg-green-700"
          >
            Retry <Play size={14} />
          </button>
        </div>
      </div>
    </li>
  );
}
