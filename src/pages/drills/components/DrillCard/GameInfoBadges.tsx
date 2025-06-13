// GameInfoBadges.tsx
import { TrendingDown, User } from 'lucide-react';

import { formatTimeControl } from '@/lib/formatTimeControl';

type Props = {
  timeClass: string;
  timeControl: string;
  opponent: { username: string; rating: number };
  evalSwing: number;
  heroResult: 'win' | 'loss' | 'draw';
  eco?: string;
  ecoUrl?: string;
  hideGameResult?: boolean;
  hideOpponentRating?: boolean;
};

export function GameInfoBadges({
  timeClass,
  timeControl,
  opponent,
  evalSwing,
  heroResult,
  eco,
  ecoUrl,
  hideGameResult = false,
  hideOpponentRating = false,
}: Props) {
  return (
    <div className="mt-4 flex items-center gap-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded bg-stone-700 px-2 py-0.5 text-xs text-stone-400 capitalize">
          {timeClass}
        </span>
        <span className="inline-flex items-center gap-1 rounded bg-stone-700 px-2 py-0.5 text-xs text-stone-400">
          {formatTimeControl(timeControl)}
        </span>
        <span className="inline-flex items-center gap-1 rounded bg-stone-700 px-2 py-0.5 text-xs text-stone-400">
          <User className="h-3 w-3" />
          <p className="line-clamp-1">
            {opponent.username}
            {!hideOpponentRating && <>&nbsp;({opponent.rating})</>}
          </p>
        </span>
        <span className="inline-flex items-center gap-1 rounded bg-stone-700 px-2 py-0.5 text-xs text-stone-400 capitalize">
          <TrendingDown className="h-4 w-3" />
          {evalSwing > 10000 ? 'Mate' : `${evalSwing / 100} pawns`}
        </span>
        {eco && (
          <span className="inline-flex items-center gap-1 rounded bg-stone-700 px-2 py-0.5 text-xs text-stone-400">
            {ecoUrl ? (
              <a
                href={ecoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {eco}
              </a>
            ) : (
              eco
            )}
          </span>
        )}
        {!hideGameResult && (
          <span className="inline-flex items-center gap-1 rounded bg-stone-700 px-2 py-0.5 text-xs text-stone-400 capitalize">
            <span
              className={`h-2 w-2 rounded-full ${
                heroResult === 'win'
                  ? 'bg-green-500'
                  : heroResult === 'loss'
                    ? 'bg-red-500'
                    : 'bg-stone-500'
              }`}
            />
            {heroResult}
          </span>
        )}
      </div>
    </div>
  );
}
