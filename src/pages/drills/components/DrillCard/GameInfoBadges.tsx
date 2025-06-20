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
  variant?: 'default' | 'muted';
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
  variant = 'default',
}: Props) {
  const bg = variant === 'muted' ? 'bg-stone-800' : 'bg-stone-700';
  const text = variant === 'muted' ? 'text-stone-500' : 'text-stone-400';
  const badgeClass = `inline-flex items-center gap-1 rounded ${bg} px-2 py-0.5 text-xs ${text}`;

  return (
    <div className="mt-4 flex items-center gap-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`${badgeClass} capitalize`}>{timeClass}</span>
        <span className={badgeClass}>{formatTimeControl(timeControl)}</span>
        <span className={badgeClass}>
          <User className="h-3 w-3" />
          <p className="line-clamp-1">
            {opponent.username}
            {!hideOpponentRating && <>&nbsp;({opponent.rating})</>}
          </p>
        </span>
        <span className={`${badgeClass} capitalize`}>
          <TrendingDown className="h-4 w-3" />
          {evalSwing > 10000 ? 'Mate' : `${evalSwing / 100} pawns`}
        </span>
        {eco && (
          <span className={badgeClass}>
            {ecoUrl ? (
              <a href={ecoUrl} target="_blank" rel="noopener noreferrer">
                {eco}
              </a>
            ) : (
              eco
            )}
          </span>
        )}
        {!hideGameResult && (
          <span className={`${badgeClass} capitalize`}>
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
