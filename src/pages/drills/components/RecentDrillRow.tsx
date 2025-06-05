import { Chessboard } from 'react-chessboard';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Play } from 'lucide-react';

import type { DrillPosition } from '@/types';

interface Props {
  drill: DrillPosition;
  onPlay: (id: number) => void;
}

export default function RecentDrillRow({ drill, onPlay }: Props) {
  const orientation = drill.ply % 2 === 1 ? 'black' : 'white';

  const last = [...drill.history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];

  const resultLabel = last
    ? last.result === 'pass'
      ? 'Passed'
      : 'Failed'
    : '-';
  const resultColor = last
    ? last.result === 'pass'
      ? 'text-green-400'
      : 'text-red-500'
    : 'text-gray-400';

  const dateStr = drill.last_drilled_at
    ? formatDistanceToNow(parseISO(drill.last_drilled_at), {
        addSuffix: true,
      }).replace(/^about\s*/, '')
    : '';

  return (
    <li className="flex items-center gap-3 rounded-lg bg-gray-800 p-3">
      <Chessboard
        position={drill.fen}
        boardOrientation={orientation}
        arePiecesDraggable={false}
        boardWidth={120}
        customBoardStyle={{ borderRadius: '0.5rem' }}
        customDarkSquareStyle={{ backgroundColor: '#B1B7C8' }}
        customLightSquareStyle={{ backgroundColor: '#F5F2E6' }}
      />
      <div className="flex flex-1 flex-col space-y-0.5 overflow-hidden">
        <div className="flex justify-between text-sm">
          <span className="truncate font-semibold">
            vs {drill.opponent_username} ({drill.opponent_rating})
          </span>
          <span className={resultColor}>{resultLabel}</span>
        </div>
        {drill.mastered && (
          <span className="text-xs font-semibold text-green-500">Mastered</span>
        )}
        {dateStr && <span className="text-xs text-gray-400">{dateStr}</span>}
      </div>
      <button
        onClick={() => onPlay(drill.id)}
        className="ml-2 inline-flex items-center gap-1 rounded bg-green-600 px-2 py-1 text-sm text-white hover:bg-green-700"
      >
        <Play size={14} />
        Drill
      </button>
    </li>
  );
}
