// src/pages/games/components/GameCard.tsx
import { Calendar, Timer } from 'lucide-react';
import { GameRecord } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface GameCardProps {
  game: GameRecord;
  hero: string;
  isAnalysed: boolean;
  onAction: (game: GameRecord) => void;
}

export default function GameCard({
  game,
  hero,
  isAnalysed,
  onAction,
}: GameCardProps) {
  // extract player metadata
  const wMeta = game.meta.players.white;
  const bMeta = game.meta.players.black;
  const whitePlayer = wMeta.player;
  const blackPlayer = bMeta.player;
  const whiteRating = wMeta.rating;
  const blackRating = bMeta.rating;

  // determine side and result
  const side = whitePlayer.username === hero ? 'white' : 'black';
  const resultTag = game.meta.pgnTags?.Result || '';
  const won = resultTag === (side === 'white' ? '1-0' : '0-1');
  const lost = resultTag === (side === 'white' ? '0-1' : '1-0');

  // button label and color
  const btnLabel = isAnalysed ? 'View Report' : 'Analyse';
  const btnColor = isAnalysed
    ? 'bg-green-600 hover:bg-green-700'
    : 'bg-blue-600 hover:bg-blue-700';

  // date & time control
  const dateTime = new Date(game.meta.endTime * 1000);
  const dateStr = formatDistanceToNow(dateTime, { addSuffix: true });
  const init = game.meta.timeControl;
  const inc = game.meta.increment;
  const mins = Math.floor(init / 60);
  const secs = init % 60;
  let tcStr = '';
  if (mins > 0) {
    tcStr = `${mins}m`;
    if (secs > 0) tcStr += `${secs}s`;
  } else {
    tcStr = `${secs}s`;
  }

  if (inc > 0) {
    tcStr += ` +${inc}s`;
  }

  return (
    <li
      className={`mb-6 flex flex-col rounded-lg border-l-4 bg-gray-800 p-6 ${
        won ? 'border-green-500' : lost ? 'border-red-500' : 'border-gray-500'
      }`}
    >
      <header className="mb-4 flex items-center justify-between">
        {/* White side */}
        <div className="flex items-center space-x-2">
          <span className="text-xl text-white">♞</span>
          <span className="text-lg font-semibold text-white">
            {whitePlayer.username}
          </span>
          <span className="text-sm text-gray-400">({whiteRating})</span>
        </div>

        <span className="font-medium text-gray-500">vs</span>

        {/* Black side */}
        <div className="flex items-center space-x-2">
          <span className="text-xl text-black">♞</span>
          <span className="text-lg font-semibold text-white">
            {blackPlayer.username}
          </span>
          <span className="text-sm text-gray-400">({blackRating})</span>
        </div>
      </header>

      <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-gray-400">
        <div className="flex items-center space-x-1">
          <Calendar size={16} />
          <time dateTime={dateTime.toISOString()}>{dateStr}</time>
        </div>
        <div className="flex items-center space-x-1">
          <Timer size={16} />
          <span>
            {tcStr}{' '}
            <em>{game.meta.pgnTags?.Rated === 'true' ? 'Rated' : 'Casual'}</em>
          </span>
        </div>
      </div>

      <footer className="flex items-center justify-between">
        <div className="flex space-x-1">
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              won
                ? 'bg-green-600 text-white'
                : lost
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-600 text-white'
            }`}
          >
            {won ? 'Won' : lost ? 'Lost' : 'Draw'}
          </span>
          {resultTag && (
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium italic ${
                won || lost
                  ? 'bg-gray-800 text-gray-400'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              ({resultTag})
            </span>
          )}
        </div>
        <button
          onClick={() => onAction(game)}
          className={`rounded-md px-4 py-2 text-sm font-medium text-white ${btnColor}`}
        >
          {btnLabel}
        </button>
      </footer>
    </li>
  );
}
