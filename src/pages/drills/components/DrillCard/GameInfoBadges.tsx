// src/pages/components/DrillCard/GameInfoBadges.tsx
import { TrendingDown, User } from 'lucide-react';

import { ecoLookup } from '@/const/eco';
import { formatTimeControl } from '@/lib/formatTimeControl';
import { getDisplayReason } from '@/lib/gameResult';

type Props = {
  timeClass: string;
  timeControl: string;
  opponent?: { username: string; rating: number };
  evalSwing?: number;
  heroResult: 'win' | 'loss' | 'draw';
  eco?: string;
  ecoUrl?: string;
  hideGameResult?: boolean;
  hideOpponentRating?: boolean;
  variant?: 'default' | 'muted';
  reason?: string; // optional reason for the result
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
  reason,
}: Props) {
  const bg = variant === 'muted' ? 'bg-stone-800' : 'bg-stone-700';
  const text = variant === 'muted' ? 'text-stone-500' : 'text-stone-400';
  const badgeClass = `inline-flex items-center gap-1 rounded ${bg} px-2 py-0.5 text-xs ${text}`;

  const ecoTags = eco ? ecoLookup[eco] : undefined;
  const ecoMain = ecoTags?.main ?? eco;
  const ecoSub = ecoTags?.sub;

  const displayReason = getDisplayReason(reason);

  return (
    <div className="mt-4 flex items-center gap-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`${badgeClass} capitalize`}>{timeClass}</span>
        <span className={badgeClass}>{formatTimeControl(timeControl)}</span>
        {opponent && (
          <span className={badgeClass}>
            <User className="h-3 w-3" />
            <p className="line-clamp-1">
              {opponent.username}
              {!hideOpponentRating && <>&nbsp;({opponent.rating})</>}
            </p>
          </span>
        )}
        {evalSwing != null && (
          <span className={`${badgeClass} capitalize`}>
            <TrendingDown className="h-4 w-3" />
            {evalSwing > 10000 ? 'Mate' : `${evalSwing / 100} pawns`}
          </span>
        )}
        {eco && (
          <span className={badgeClass}>
            {ecoUrl ? (
              <a href={ecoUrl} target="_blank" rel="noopener noreferrer">
                {ecoMain}
                {ecoSub && ` (${ecoSub})`}
              </a>
            ) : (
              <>
                {ecoMain}
                {ecoSub && ` (${ecoSub})`}
              </>
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
        {displayReason && (
          <span className="inline-flex items-center gap-1 rounded bg-stone-700 px-2 py-0.5 text-xs text-stone-400">
            <span
              className={`h-2 w-2 rounded-full ${
                heroResult === 'win'
                  ? 'bg-green-500'
                  : heroResult === 'loss'
                    ? 'bg-red-500'
                    : 'bg-stone-500'
              }`}
            />
            {displayReason}
          </span>
        )}
      </div>
    </div>
  );
}
