import { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';

import { useChessComRatings } from '@/hooks/useChessComRatings';
import { useProfile } from '@/hooks/useProfile';
import { useRecentGames } from '@/pages/games/hooks/useRecentGames';
import WinRateDial from '@/pages/insights/components/WinRateDial';

export default function PlayerProfile() {
  const { profile } = useProfile();
  const { rating, timeClass } = useChessComRatings();
  const { games } = useRecentGames(profile.username, 5);

  const form = useMemo(() => {
    if (!games.length) return '';
    return games
      .slice(0, 5)
      .map((g) => {
        const white =
          g.meta.players.white.player.username.toLowerCase() ===
          profile.username.toLowerCase();
        const result = g.meta.pgnTags?.Result;
        const won = result === (white ? '1-0' : '0-1');
        const lost = result === (white ? '0-1' : '1-0');
        return won ? 'W' : lost ? 'L' : 'D';
      })
      .join(' ');
  }, [games, profile.username]);

  const strengths = [
    'Tactical awareness',
    'Aggressive attacker',
    'Strong with open positions',
  ];
  const weaknesses = ['Endgame technique', 'Time management', 'Closed games'];
  const bestOpenings = [
    { name: 'Sicilian Defense', win: 68 },
    { name: 'Ruy Lopez', win: 65 },
    { name: 'Italian Game', win: 62 },
  ];
  const worstOpenings = [
    { name: 'French Defense', win: 32 },
    { name: 'Caro-Kann', win: 35 },
    { name: 'Pirc Defense', win: 40 },
  ];

  const countryCode = profile.country?.split('/').pop()?.toUpperCase() || '';
  const flagEmoji = countryCode
    ? countryCode
        .split('')
        .map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
        .join('')
    : '';

  return (
    <div className="p-4 pt-16 2xl:ml-12">
      <div className="mx-auto max-w-xl space-y-8">
        <header className="flex items-center space-x-4">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={`${profile.username} avatar`}
              className="h-20 w-20 rounded-full border border-stone-600"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-stone-600" />
          )}
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {profile.name || profile.username}{' '}
              {flagEmoji && <span className="ml-1 text-xl">{flagEmoji}</span>}
            </h1>
            <p className="text-sm text-stone-400">@{profile.username}</p>
            {profile.last_online && (
              <p className="text-xs text-stone-500">
                Last online{' '}
                {formatDistanceToNow(new Date(profile.last_online * 1000), {
                  addSuffix: true,
                })}
              </p>
            )}
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center rounded bg-stone-800 p-4">
            <WinRateDial
              rate={rating || 0}
              color="#fbbf24"
              label={`${timeClass} rating`}
            />
          </div>
          <div className="flex flex-col items-center justify-center rounded bg-stone-800 p-4 text-stone-200">
            <p className="text-sm">Current Form</p>
            <p className="text-xl font-semibold tracking-wide">
              {form || 'N/A'}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2 rounded bg-stone-800 p-4">
            <h2 className="text-lg font-semibold text-stone-200">Strengths</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-stone-400">
              {strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2 rounded bg-stone-800 p-4">
            <h2 className="text-lg font-semibold text-stone-200">Weaknesses</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-stone-400">
              {weaknesses.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2 rounded bg-stone-800 p-4">
            <h2 className="text-lg font-semibold text-stone-200">
              Best Openings
            </h2>
            <ul className="space-y-1 text-sm text-stone-400">
              {bestOpenings.map((o) => (
                <li key={o.name} className="flex justify-between">
                  <span>{o.name}</span>
                  <span className="text-stone-200">{o.win}%</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2 rounded bg-stone-800 p-4">
            <h2 className="text-lg font-semibold text-stone-200">
              Worst Openings
            </h2>
            <ul className="space-y-1 text-sm text-stone-400">
              {worstOpenings.map((o) => (
                <li key={o.name} className="flex justify-between">
                  <span>{o.name}</span>
                  <span className="text-stone-200">{o.win}%</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
