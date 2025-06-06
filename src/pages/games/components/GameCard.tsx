// src/pages/games/components/GameCard.tsx
import { formatDistanceToNow } from 'date-fns';
import { Calendar, Inspect, Loader, Timer } from 'lucide-react';

import { GameRecord } from '@/types';

interface GameCardProps {
  game: GameRecord;
  hero: string;
  isAnalysed: boolean;
  isLoading: boolean;
  onAction: (game: GameRecord) => void;
}

export default function GameCard({
  game,
  hero,
  isAnalysed: _isAnalysed,
  isLoading,
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

  // date & time control
  const dateTime = new Date(game.meta.endTime * 1000);
  let dateStr = formatDistanceToNow(dateTime, { addSuffix: true }).replace(
    /^about\s*/,
    ''
  );

  const init = game.meta.timeControl;
  const inc = game.meta.increment;
  const mins = Math.floor(init / 60);
  const secs = init % 60;
  let tcStr = mins > 0 ? `${mins}m${secs ? `${secs}s` : ''}` : `${secs}s`;
  if (inc > 0) tcStr += ` +${inc}s`;

  // result
  const yourMeta = side === 'white' ? wMeta : bMeta;
  const opponentMeta = side === 'white' ? bMeta : wMeta;
  let rawReason: string | undefined;
  if (won) {
    rawReason = opponentMeta.result; // how they lost
  } else if (lost) {
    rawReason = yourMeta.result; // how you lost
  } else {
    rawReason = opponentMeta.result; // draw → “stalemate” / “agreed”
  }
  const reason = rawReason
    ?.split('_')
    .join(' ') // turn snake_case into words
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize each word

  return (
    <li
      className={
        `mt-6 flex flex-col rounded-lg border-l-6 bg-stone-800 px-5 py-4 ` +
        (won
          ? 'border-green-500'
          : lost
            ? 'border-red-600'
            : 'border-stone-500')
      }
    >
      {/* Header: players & ratings */}
      <header className="mt-2 mb-0 grid grid-cols-[1fr_auto_1fr] items-center gap-x-2">
        {/* White */}
        <div className="flex items-center space-x-1 truncate">
          <span className="mr-2 text-xl">♞</span>
          <span className="truncate text-lg font-semibold">
            {whitePlayer.username}
          </span>
          <span className="xs:flex hidden text-sm text-gray-500">
            ({whiteRating})
          </span>
        </div>

        {/* vs */}
        <span className="text-sm text-gray-500">vs</span>

        {/* Black */}
        <div className="flex items-center justify-end space-x-1 truncate">
          <span className="mr-2 text-xl text-black [text-shadow:-0.5px_-0.5px_0_#fff,0.5px_-0.5px_0_#fff,-0.5px_0.5px_0_#fff,0.5px_0.5px_0_#fff]">
            ♞
          </span>
          <span className="truncate text-lg font-semibold">
            {blackPlayer.username}
          </span>
          <span className="xs:flex hidden text-sm text-gray-500">
            ({blackRating})
          </span>
        </div>
      </header>

      {/* Meta: date & time control */}
      <div className="mt-1 mb-2 flex space-x-4 text-sm text-gray-400">
        <div className="flex items-center space-x-1">
          <Calendar size={16} />
          <time dateTime={dateTime.toISOString()}>{dateStr}</time>
        </div>
        <div className="flex items-center space-x-1">
          <Timer size={16} /> {tcStr}{' '}
          <em className="ml-2">
            {game.meta.rated === true ? '' : '(Unrated)'}
          </em>
        </div>
      </div>

      {/* Footer: result & action */}

      <footer className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span
            className={
              `rounded-full px-3 py-1 text-sm font-medium ` +
              (won
                ? 'bg-green-500 text-white'
                : lost
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-600 text-white')
            }
          >
            {won ? 'Won' : lost ? 'Lost' : 'Draw'}
          </span>

          {reason && <span className="text-sm text-gray-500">{reason}</span>}
        </div>

        <button
          onClick={() => onAction(game)}
          disabled={isLoading}
          className={`rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700`}
        >
          {isLoading ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <span>
              <Inspect className="mr-2 inline-flex h-4 w-4" />
              Analyse
            </span>
          )}
        </button>
      </footer>
    </li>
  );
}
