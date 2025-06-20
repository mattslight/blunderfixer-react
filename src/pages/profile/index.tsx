import { Circle, Play, Share2, Users } from 'lucide-react';

import { useProfile } from '@/hooks/useProfile';

export default function ProfilePage() {
  // real profile from context (only has basic Chess.com fields)
  const { profile: ctx } = useProfile();
  const { username, avatar, country } = ctx;

  // mock data for stats and insights not provided by Chess.com API
  const stats = {
    blundersFixed: 45,
    tacticAccuracy: 64,
    winOpenings: 75,
    endgameWins: 48,
  };
  const rating = 1237; // mock rating
  const winRate = { white: 58, black: 42 };
  const strengths = [
    { name: 'Sicilian Defense', score: 72 },
    { name: "Queen's Gambit", score: 68 },
    { name: 'Caro-Kann Defense', score: 65 },
  ];
  const weaknesses = [
    { name: "King's Gambit", score: 28 },
    { name: 'Scotch Game', score: 32 },
  ];
  const form = ['win', 'loss', 'draw', 'win', 'win'];

  // derive flag emoji
  const code = country?.split('/').pop()?.toUpperCase() || 'US';
  const flag = code
    .split('')
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
    .join('');

  const metrics = [
    { icon: '⚔️', label: 'Blunders', value: stats.blundersFixed },
    { icon: '🎯', label: 'Tactic Acc.', value: `${stats.tacticAccuracy}%` },
    { icon: '🏆', label: 'Openings', value: `${stats.winOpenings}%` },
    { icon: '♟️', label: 'Endgame', value: `${stats.endgameWins}%` },
    { icon: '⚪', label: 'White Win', value: `${winRate.white}%` },
    { icon: '⚫', label: 'Black Win', value: `${winRate.black}%` },
  ];

  return (
    <div className="flex items-start justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-black/40 shadow-lg">
        {/* Banner */}
        <div className="bg-chessboard-pattern h-24 bg-stone-900" />

        {/* Avatar */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 transform">
          <img
            src={avatar || 'https://via.placeholder.com/64'}
            alt={`${username} avatar`}
            className="h-16 w-16 rounded-full border-2 border-stone-800"
          />
        </div>

        {/* Header Info */}
        <div className="mt-12 space-y-1 px-4 pt-4 pb-6 text-center">
          <div className="flex items-center justify-center space-x-1">
            <h1 className="text-xl font-bold text-white">{username}</h1>
            {flag && <span className="text-lg">{flag}</span>}
          </div>
          <div className="text-sm text-stone-400">Rating {rating || '–––'}</div>
          <div className="mt-2 flex justify-center space-x-2">
            <button className="inline-flex items-center rounded-full bg-blue-600 px-4 py-1 text-sm text-white hover:bg-blue-500">
              <Users className="mr-1 h-4 w-4" />
              Follow
            </button>
            <button className="inline-flex items-center rounded-full bg-green-600 px-4 py-1 text-sm text-white hover:bg-green-500">
              <Play className="mr-1 h-4 w-4 rotate-90" />
              Drill
            </button>
          </div>
        </div>

        {/* Metrics Strip */}
        <div className="overflow-x-auto px-4 py-2">
          <div className="flex space-x-4">
            {metrics.map(({ icon, label, value }) => (
              <div
                key={label}
                className="flex flex-shrink-0 flex-col items-center rounded-xl bg-stone-800 px-3 py-2"
              >
                <span className="text-base">{icon}</span>
                <span className="mt-1 text-lg font-bold text-white">
                  {value}
                </span>
                <span className="text-xs text-stone-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Openings */}
        <div className="space-y-3 px-4 py-3">
          <section>
            <h2 className="mb-1 text-sm font-semibold text-stone-200">
              Top Openings
            </h2>
            <ul className="space-y-2">
              {strengths.map((o) => (
                <li
                  key={o.name}
                  className="flex items-center justify-between text-sm text-white"
                >
                  <span>{o.name}</span>
                  <div className="ml-2 h-1 w-20 overflow-hidden rounded-full bg-stone-800">
                    <div
                      className="h-1 bg-green-500"
                      style={{ width: `${o.score}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Weak Openings */}
          <section>
            <h2 className="mb-1 text-sm font-semibold text-stone-200">
              Weak Openings
            </h2>
            <ul className="space-y-2">
              {weaknesses.map((o) => (
                <li
                  key={o.name}
                  className="flex items-center justify-between text-sm text-white"
                >
                  <span>{o.name}</span>
                  <div className="ml-2 h-1 w-20 overflow-hidden rounded-full bg-stone-800">
                    <div
                      className="h-1 bg-red-500"
                      style={{ width: `${o.score}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Recent Form */}
        <div className="px-4 py-3">
          <h2 className="mb-1 text-sm font-semibold text-stone-200">
            Recent Form
          </h2>
          <div className="flex space-x-2">
            {form.map((f, i) => {
              const col =
                f === 'win'
                  ? 'text-green-500'
                  : f === 'loss'
                    ? 'text-red-500'
                    : 'text-yellow-500';
              return <Circle key={i} className={`${col} h-5 w-5`} />;
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end border-t border-stone-700 px-4 py-3">
          <button className="items-center rounded-full bg-indigo-600 px-4 py-1 text-sm text-white hover:bg-indigo-500">
            <Share2 className="mr-1 inline-flex h-4 w-4" /> Share
          </button>
        </div>
      </div>
    </div>
  );
}
