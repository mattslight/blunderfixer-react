// src/pages/games/components/GameCard.tsx
import { formatDistanceToNow } from 'date-fns';
import { ChartNoAxesCombined, Clock, Loader } from 'lucide-react';

import { GameInfoBadges } from '@/pages/drills/components/DrillCard/GameInfoBadges';
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
  const heroResult = won ? 'win' : lost ? 'loss' : 'draw';

  // date & time control
  const dateTime = new Date(game.meta.endTime * 1000);
  let dateStr = formatDistanceToNow(dateTime, { addSuffix: true }).replace(
    /^about\s*/,
    ''
  );

  const init = game.meta.timeControl;
  const inc = game.meta.increment;

  const badgeTimeControl = `${init}${inc > 0 ? `+${inc}` : ''}`;

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
        `mt-6 flex flex-col rounded-sm border-l-4 bg-stone-800 px-5 py-4 ` +
        (won
          ? 'border-green-500'
          : lost
            ? 'border-red-600'
            : 'border-stone-500')
      }
    >
      {/* Header: players & ratings */}
      <header className="mb-0 grid grid-cols-[1fr_auto_1fr] items-center gap-x-2">
        {/* White */}
        <div className="flex items-center space-x-1 truncate">
          <span className="mr-2 text-lg">♞</span>
          <span className="truncate text-base font-semibold">
            {whitePlayer.username}
          </span>
          <span className="xs:flex hidden text-sm text-stone-500">
            ({whiteRating})
          </span>
        </div>

        {/* vs */}
        <span className="text-sm text-stone-500">vs</span>

        {/* Black */}
        <div className="flex items-center justify-end space-x-1 truncate">
          <span className="mr-2 text-lg text-black [text-shadow:-0.5px_-0.5px_0_#fff,0.5px_-0.5px_0_#fff,-0.5px_0.5px_0_#fff,0.5px_0.5px_0_#fff]">
            ♞
          </span>
          <span className="truncate text-base font-semibold">
            {blackPlayer.username}
          </span>
          <span className="xs:flex hidden text-sm text-stone-500">
            ({blackRating})
          </span>
        </div>
      </header>

      {/* Meta: date & time control */}
      <div className="mt-1 mb-2 flex space-x-4 text-xs text-stone-800">
        <div className="flex items-center space-x-1">
          <Clock size={14} />
          <time dateTime={dateTime.toISOString()}>{dateStr}</time>
        </div>
      </div>

      {/* → GameInfoBadges */}
      <GameInfoBadges
        timeClass={game.meta.timeClass}
        timeControl={badgeTimeControl}
        heroResult={heroResult}
        eco={game.meta.pgnTags?.ECO}
        ecoUrl={game.meta.pgnTags?.ECOUrl}
        hideGameResult
        reason={reason}
      />

      {/* Footer: result & action */}

      <footer className="mt-4 flex items-center justify-end">
        <button
          onClick={() => onAction(game)}
          disabled={isLoading}
          className={`rounded bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700`}
        >
          {isLoading ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <span>
              <ChartNoAxesCombined className="relative bottom-0.5 mr-2 inline-flex h-4 w-4" />
              Review
            </span>
          )}
        </button>
      </footer>
    </li>
  );
}
