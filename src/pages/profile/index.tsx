import { Share2, UserRoundPlus, Users } from 'lucide-react';

import EloDisplay from '@/components/EloDisplay';
import { useProfile } from '@/hooks/useProfile';

function acplToBlunderRate(acpl: number): number {
  return +(3 / (1 + Math.exp(-0.04 * (acpl - 75)))).toFixed(1);
}

function acplToAccuracy(acpl: number): number {
  // anchor points [ACPL, Accuracy%]
  const curve = [
    [0, 100],
    [20, 97],
    [50, 92],
    [100, 85],
    [150, 78],
    [200, 70],
    [300, 60],
  ] as const;

  // below first anchor
  if (acpl <= curve[0][0]) return curve[0][1];

  // find the segment we sit in
  for (let i = 0; i < curve.length - 1; i++) {
    const [x0, y0] = curve[i];
    const [x1, y1] = curve[i + 1];
    if (acpl <= x1) {
      const t = (acpl - x0) / (x1 - x0);
      return +(y0 + (y1 - y0) * t).toFixed(1);
    }
  }

  // beyond last anchor, clamp to the last accuracy
  return curve[curve.length - 1][1];
}

export default function ProfilePage() {
  const { profile: ctx } = useProfile();
  const { username, avatar, country } = ctx;

  // mock data for stats/insights
  const acplStats = {
    combined: 89,
    opening: 150,
    middle: 50,
    endgame: 20,
  };

  const stats = {
    blundersRate: acplToBlunderRate(acplStats.combined),
    tacticAccuracy: acplToAccuracy(acplStats.middle),
    winOpenings: acplToAccuracy(acplStats.opening),
    endgameWins: acplToAccuracy(acplStats.endgame),
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

  // derive flag emoji
  const code = country?.split('/').pop()?.toUpperCase() || 'US';
  const flag = code
    .split('')
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
    .join('');

  const metrics = [
    { icon: '⚔️', label: 'Blunder Rate', value: stats.blundersRate },
    { icon: '🏆', label: 'Opening Accuracy', value: `${stats.winOpenings}%` },
    {
      icon: '🎯',
      label: 'Tactic Accuracy',
      value: `${stats.tacticAccuracy}%`,
    },
    { icon: '♟️', label: 'Endgame Accuracy', value: `${stats.endgameWins}%` },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center pb-48">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-black/50 shadow-2xl">
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
        <div className="xs:grid-cols-4 grid grid-cols-2 gap-4 px-6 py-4">
          {metrics.map(({ icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center rounded-lg bg-stone-800 p-4"
            >
              <span className="text-2xl">{icon}</span>
              <span className="mt-2 text-xl font-semibold text-white">
                {value}
              </span>
              <span className="mt-1 text-center text-xs text-stone-500">
                {label}
              </span>
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

        {/* Most Played Opponents */}
        <div className="px-6 py-6">
          <h2 className="mb-4 text-xl font-bold tracking-wide text-stone-100">
            Most Played Opponents
          </h2>
          {[
            {
              name: 'bharamp',
              record: '12 games • 7w - 3l - 2d',
              avatar:
                'https://images.chesscomfiles.com/uploads/v1/user/185825115.32a36274.200x200o.9f12377a22e0.jpg',
            },
            {
              name: 'merlinjose',
              record: '10 games • 3w - 8l - 1d',
              avatar:
                'https://images.chesscomfiles.com/uploads/v1/user/7743090.6bc5301a.200x200o.989f43012e64.jpg',
            },
            {
              name: 'hikaru',
              record: '10 games • 11w - 8l - 1d',
              avatar:
                'https://images.chesscomfiles.com/uploads/v1/user/15448422.88c010c1.200x200o.3c5619f5441e.png',
            },
          ].map((opponent, i) => (
            <div
              key={i}
              className="flex items-center space-x-4 border-b border-stone-800 py-2 last:border-none"
            >
              <img
                src={opponent.avatar} // ✅ use dynamic opponent avatar
                alt={`${opponent.name} avatar`}
                className="h-10 w-10 rounded-full"
              />
              <div>
                <p className="text-base font-semibold text-white">
                  {opponent.name}
                </p>
                <p className="text-sm text-stone-400">{opponent.record}</p>
              </div>
            </div>
          ))}
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
