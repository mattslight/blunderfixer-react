import { Share2, UserRoundPlus, Users } from 'lucide-react';

import EloDisplay from '@/components/EloDisplay';
import { useProfile } from '@/hooks/useProfile';

export default function ProfilePage() {
  const { profile: ctx } = useProfile();
  const { username, avatar, country } = ctx;

  // mock data for stats/insights
  const stats = {
    blundersRate: 1.2,
    tacticAccuracy: 64,
    winOpenings: 75,
    endgameWins: 48,
  };
  const strengths = [
    { name: 'Sicilian Defense', score: 72 },
    { name: "Queen's Gambit", score: 68 },
    { name: 'Caro-Kann Defense', score: 65 },
  ];
  const weaknesses = [
    { name: "King's Gambit", score: 28 },
    { name: 'Scotch Game', score: 32 },
  ];
  const form = ['win', 'win', 'draw', 'loss', 'win'];

  // derive flag emoji
  const code = country?.split('/').pop()?.toUpperCase() || 'US';
  const flag = code
    .split('')
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
    .join('');

  const metrics = [
    { icon: '⚔️', label: 'Blunder Rate', value: stats.blundersRate },
    { icon: '🏆', label: 'Opening Accuracy.', value: `${stats.winOpenings}%` },
    {
      icon: '🎯',
      label: 'Tactic Accuracy.',
      value: `${stats.tacticAccuracy}%`,
    },
    { icon: '♟️', label: 'Endgame Accuracy', value: `${stats.endgameWins}%` },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-black/50 shadow-2xl">
        {/* Banner */}
        <div className="bg-chessboard-pattern h-32 bg-stone-900" />

        {/* Avatar & Header */}
        <div className="relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 transform">
            <img
              src={avatar || 'https://via.placeholder.com/80'}
              alt={`${username} avatar`}
              className="h-20 w-20 rounded-full border-4 border-stone-800"
            />
          </div>
          <div className="px-6 pt-12 pb-8 text-center">
            <h1 className="text-3xl leading-tight font-bold text-white">
              {username}
              {flag && (
                <span className="ml-2 align-middle text-xl">{flag}</span>
              )}
            </h1>
            <EloDisplay />
            <div className="mt-4 flex justify-center space-x-4">
              <button className="flex items-center rounded bg-indigo-600 px-6 py-2 text-base text-white hover:bg-indigo-500">
                <Users className="mr-2 h-5 w-5" /> Follow
              </button>
              <button className="flex items-center rounded bg-green-500 px-6 py-2 text-base text-white hover:bg-green-500">
                <UserRoundPlus className="mr-2 h-5 w-5" /> Invite
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Strip */}
        <div className="grid grid-cols-2 gap-4 px-6 py-4 sm:grid-cols-4">
          {metrics.map(({ icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center rounded-lg bg-stone-800 p-4"
            >
              <span className="text-2xl">{icon}</span>
              <span className="mt-2 text-xl font-semibold text-white">
                {value}
              </span>
              <span className="mt-1 text-xs text-stone-500">{label}</span>
            </div>
          ))}
        </div>

        {/* Openings Sections */}
        <div className="space-y-6 px-6 py-6">
          <div>
            <h2 className="mb-3 text-xl font-bold tracking-wide text-stone-100">
              Top Openings
            </h2>
            <ul className="space-y-2">
              {strengths.map((o) => (
                <li key={o.name} className="flex items-center justify-between">
                  <span className="text-base text-stone-400">{o.name}</span>
                  <div className="ml-4 h-2 flex-1 overflow-hidden rounded-full bg-stone-800">
                    <div
                      className="h-2 bg-green-500"
                      style={{ width: `${o.score}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-xl font-bold tracking-wide text-stone-100">
              Weak Openings
            </h2>
            <ul className="space-y-2">
              {weaknesses.map((o) => (
                <li key={o.name} className="flex items-center justify-between">
                  <span className="text-base text-stone-400">{o.name}</span>
                  <div className="ml-4 h-2 flex-1 overflow-hidden rounded-full bg-stone-800">
                    <div
                      className="h-2 bg-red-500"
                      style={{ width: `${o.score}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Form */}
        <div className="px-6 py-6">
          <h2 className="mb-3 text-xl font-bold tracking-wide text-stone-100">
            Form
          </h2>
          <div className="flex space-x-3">
            {form.map((f, i) => {
              let bg = 'bg-stone-500';
              let letter = 'D';
              if (f === 'win') {
                bg = 'bg-green-600';
                letter = 'W';
              } else if (f === 'loss') {
                bg = 'bg-red-600';
                letter = 'L';
              }
              return (
                <div
                  key={i}
                  className={`${bg} flex h-8 w-8 items-center justify-center rounded-full text-base font-bold text-white`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        </div>

        {/* Share Footer */}
        <div className="flex justify-center px-6 py-8">
          <button className="flex items-center rounded bg-indigo-600 px-8 py-3 text-base font-semibold text-white hover:bg-indigo-500">
            <Share2 className="mr-2 h-5 w-5" /> Share Profile
          </button>
        </div>
      </div>
    </div>
  );
}
