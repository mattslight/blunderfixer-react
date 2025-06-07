import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Play, Target } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import NextDrillCarousel from './components/NextDrillCarousel';
import { greetings } from './greetings.js';

import { useProfile } from '@/hooks/useProfile';
import { parseChessComGame } from '@/lib/chessComParser';
import { useRecentDrills } from '@/pages/drills/hooks/useRecentDrills';
import GameList from '@/pages/games/components/GameList';
import { useRecentGames } from '@/pages/games/hooks/useRecentGames';

function WinRateDial({
  rate,
  color,
  label,
}: {
  rate: number;
  color: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-16 w-16">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="80%"
            outerRadius="100%"
            startAngle={90}
            endAngle={450}
            data={[{ name: label, value: rate }]}
          >
            <RadialBar dataKey="value" cornerRadius={5} fill={color} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-stone-100">
          {rate}%
        </div>
      </div>
      <p className="mt-1 text-xs text-stone-200">{label}</p>
    </div>
  );
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const {
    profile: { username },
  } = useProfile();
  const [showCharts, setShowCharts] = useState(false);

  const { drills, loading: loadingDrills } = useRecentDrills(username, {
    limit: 3,
  });
  const { games: rawGames, loading: loadingGames } = useRecentGames(
    username,
    3
  );

  const nextDrillId = drills[0]?.id;

  const games = Array.isArray(rawGames) ? rawGames.map(parseChessComGame) : [];

  // const showEmpty =
  //   !games.length && !drills.length && !loadingDrills && !loadingGames;

  const randomGreeting = useMemo(() => {
    return greetings[Math.floor(Math.random() * greetings.length)];
  }, []);

  const acplData = [
    { phase: 'Opening', acpl: 32 },
    { phase: 'Middle', acpl: 47 },
    { phase: 'Late', acpl: 38 },
    { phase: 'Endgame', acpl: 28 },
  ];

  const ecoData = [
    { eco: 'B20', score: 70 },
    { eco: 'C50', score: 60 },
    { eco: 'D30', score: 65 },
    { eco: 'E60', score: 55 },
  ];

  const lossReasonsData = [
    { reason: 'Pawn push', games: 5 },
    { reason: 'Knight fork', games: 3 },
    { reason: 'Hung mate', games: 2 },
    { reason: 'Impulsive', games: 8 },
  ];

  const timeControlData = [
    { control: 'Bullet', impulsive: 5, slow: 1 },
    { control: 'Blitz', impulsive: 7, slow: 2 },
    { control: 'Rapid', impulsive: 4, slow: 3 },
    { control: 'Classical', impulsive: 1, slow: 4 },
  ];

  return (
    <>
      <div className="p-4 pt-16 2xl:ml-12">
        <div className="mx-auto max-w-3xl space-y-10">
          <header>
            <h1 className="text-4xl font-bold text-gray-100">
              Welcome back{username ? `, ${username}` : ''}!
            </h1>
            <p className="text-stone-400">{randomGreeting}</p>
            <div className="mt-4">
              <button
                onClick={() =>
                  navigate(
                    nextDrillId ? `/drills/play/${nextDrillId}` : '/drills'
                  )
                }
                className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
              >
                Start Next Drill{' '}
                <Play className="relative bottom-0.25 ml-1 inline h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Stats */}
          <section className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            <div className="rounded bg-stone-800 p-4 text-center">
              <p className="text-2xl font-semibold text-blue-400">123</p>
              <p className="text-sm text-stone-200">Blunders Fixed</p>
              <p className="mt-1 text-xs text-stone-400">
                Mistakes you corrected
              </p>
            </div>
            <div className="rounded bg-stone-800 p-4 text-center">
              <p className="text-2xl font-semibold text-green-400">64%</p>
              <p className="text-sm text-stone-200">Tactic Accuracy</p>
              <p className="mt-1 text-xs text-stone-400">
                Top-engine moves chosen
              </p>
            </div>
            <div className="xs:inline hidden rounded bg-stone-800 p-4 text-center">
              <p className="text-2xl font-semibold text-purple-400">75%</p>
              <p className="text-sm text-stone-200">Winning Openings</p>
              <p className="mt-1 text-xs text-stone-400">
                Wins from your openings
              </p>
            </div>
            <div className="xs:inline hidden rounded bg-stone-800 p-4 text-center">
              <p className="text-2xl font-semibold text-fuchsia-400">48%</p>
              <p className="text-sm text-stone-200">Endgame Wins</p>
              <p className="mt-1 text-xs text-stone-400">
                Games converted late
              </p>
            </div>
            <div className="hidden flex-col items-center justify-center rounded bg-stone-800 p-4 sm:flex">
              <WinRateDial rate={58} color="#fbbf24" label="White Win %" />
              <p className="mt-1 text-xs text-stone-400">Wins as White</p>
            </div>
            <div className="hidden flex-col items-center justify-center rounded bg-stone-800 p-4 sm:flex">
              <WinRateDial rate={42} color="#818cf8" label="Black Win %" />
              <p className="mt-1 text-xs text-stone-400">Wins as Black</p>
            </div>
          </section>

          {/* Charts */}
          <div className="mb-6 flex justify-center">
            <button
              className="flex items-center text-base font-medium text-blue-400 hover:underline"
              onClick={() => setShowCharts((v) => !v)}
            >
              {showCharts ? 'Hide Stats' : 'More Stats'}
              <ChevronDown
                className={`ml-1 h-4 w-4 transition-transform ${showCharts ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
          {showCharts && (
            <section className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-xl font-semibold text-stone-100">
                  Strength by Opening
                </h2>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={ecoData}>
                      <PolarGrid stroke="#444" />
                      <PolarAngleAxis dataKey="eco" stroke="#888" />
                      <PolarRadiusAxis stroke="#888" />
                      <Radar
                        dataKey="score"
                        stroke="#60a5fa"
                        fill="#60a5fa"
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-xl font-semibold text-stone-100">
                  Average CP Loss by Phase
                </h2>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={acplData}
                      margin={{ left: -20, right: 20 }}
                    >
                      <XAxis dataKey="phase" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="acpl"
                        stroke="#a78bfa"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-xl font-semibold text-stone-100">
                  Reason for Loss
                </h2>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={lossReasonsData}
                      margin={{ left: -20, right: 20 }}
                    >
                      <CartesianGrid stroke="#444" />
                      <XAxis dataKey="reason" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip />
                      <Bar dataKey="games" fill="#f472b6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-xl font-semibold text-stone-100">
                  Impulsive vs Slow
                </h2>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timeControlData}
                      margin={{ left: -20, right: 20 }}
                    >
                      <CartesianGrid stroke="#444" />
                      <XAxis dataKey="control" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="impulsive" fill="#60a5fa" />
                      <Bar dataKey="slow" fill="#c084fc" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
          )}

          {/* Next Drills */}
          <section className="mt-18">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-stone-100">
                <Target className="relative bottom-0.25 mr-1 inline-flex" />{' '}
                Next Drills
              </h2>
              <button
                className="text-sm text-blue-500 hover:underline"
                onClick={() => navigate('/drills')}
              >
                All Drills »
              </button>
            </div>
            {loadingDrills ? (
              <p className="mt-4 text-center text-stone-500">Loading…</p>
            ) : (
              <NextDrillCarousel
                drills={drills}
                onStart={(id) => navigate(`/drills/play/${id}`)}
              />
            )}
          </section>

          {/* Recent Games */}
          <div className="mt-18 mb-2 flex justify-between">
            <h2 className="text-2xl font-semibold text-stone-100">
              Recent Games
            </h2>
            <button
              className="text-sm text-blue-500 hover:underline"
              onClick={() => navigate('/games')}
            >
              More games »
            </button>
          </div>
          <section className="mb-20">
            <GameList
              games={games}
              hero={username}
              isAnalysed={() => false}
              isLoading={() => loadingGames}
              onAction={(g) => navigate(`/report/${g.id}`)}
            />
          </section>
        </div>
      </div>
    </>
  );
}
