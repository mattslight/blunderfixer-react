import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from 'react-router-dom';
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
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-100">
          {rate}%
        </div>
      </div>
      <p className="mt-1 text-xs text-gray-300">{label}</p>
    </div>
  );
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const {
    profile: { username },
  } = useProfile();
  const [showCharts, setShowCharts] = useState(false);
  const [showGames, setShowGames] = useState(false);

  const { drills, loading: loadingDrills } = useRecentDrills(username, {
    limit: 3,
  });
  const { games: rawGames, loading: loadingGames } = useRecentGames(
    username,
    3
  );

  const nextDrillId = drills[0]?.id;

  const games = Array.isArray(rawGames) ? rawGames.map(parseChessComGame) : [];
  const recentGameId = games[0]?.id;

  const showEmpty =
    !games.length && !drills.length && !loadingDrills && !loadingGames;

  if (showEmpty) {
    return (
      <div className="p-4 pt-8 2xl:ml-12">
        <div className="mx-auto mt-20 max-w-md space-y-6 text-center">
          <h1 className="text-2xl font-bold text-gray-100">
            Welcome{username ? `, ${username}` : ''}!
          </h1>
          <p className="text-gray-400">
            Get started by importing a game or taking a quick drill.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/games')}
              className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Import Your First Game
            </button>
            <p className="text-xs text-gray-400">Pull from Chess.com or upload PGN</p>
            <button
              onClick={() => navigate('/drills')}
              className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Take Your First Drill
            </button>
            <p className="text-xs text-gray-400">Practice a sample blunder in 60s</p>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="p-4 pt-8 2xl:ml-12">
      <div className="mx-auto max-w-5xl space-y-10">
        <header>
          <h1 className="text-2xl font-bold text-gray-100">
            Welcome back{username ? `, ${username}` : ''}!
          </h1>
          <p className="text-sm text-gray-400">
            Here&#39;s your latest progress.
          </p>
          <div className="mt-4">
            <button
              onClick={() =>
                navigate(
                  nextDrillId ? `/drills/play/${nextDrillId}` : '/drills'
                )
              }
              className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Start Next Drill
            </button>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          <div className="rounded bg-gray-800 p-4 text-center">
            <p className="text-2xl font-semibold text-blue-400">123</p>
            <p className="text-sm text-gray-300">Blunders Fixed</p>
            <p className="mt-1 text-xs text-gray-400">Mistakes you corrected</p>
          </div>
          <div className="rounded bg-gray-800 p-4 text-center">
            <p className="text-2xl font-semibold text-green-400">64%</p>
            <p className="text-sm text-gray-300">Tactic Accuracy</p>
            <p className="mt-1 text-xs text-gray-400">Top-engine moves chosen</p>
          </div>
          <div className="rounded bg-gray-800 p-4 text-center">
            <p className="text-2xl font-semibold text-purple-400">75%</p>
            <p className="text-sm text-gray-300">Winning Openings</p>
            <p className="mt-1 text-xs text-gray-400">Wins from your openings</p>
          </div>
          <div className="rounded bg-gray-800 p-4 text-center">
            <p className="text-2xl font-semibold text-fuchsia-400">48%</p>
            <p className="text-sm text-gray-300">Endgame Wins</p>
            <p className="mt-1 text-xs text-gray-400">Games converted late</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded bg-gray-800 p-4">
            <WinRateDial rate={58} color="#fbbf24" label="White Win %" />
            <p className="mt-1 text-xs text-gray-400">Wins as White</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded bg-gray-800 p-4">
            <WinRateDial rate={42} color="#818cf8" label="Black Win %" />
            <p className="mt-1 text-xs text-gray-400">Wins as Black</p>
          </div>
        </section>

        {/* Charts */}
        <div className="mb-2 flex justify-end">
          <button
            className="flex items-center text-sm text-blue-400 hover:underline"
            onClick={() => setShowCharts((v) => !v)}
          >
            {showCharts ? 'Hide Charts' : 'More Charts'}
            <ChevronDown
              className={`ml-1 h-4 w-4 transition-transform ${showCharts ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
        {showCharts && (
          <section className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-100">
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
            <h2 className="mb-4 text-xl font-semibold text-gray-100">
              Average CP Loss by Phase
            </h2>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={acplData} margin={{ left: -20, right: 20 }}>
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
            <h2 className="mb-4 text-xl font-semibold text-gray-100">
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
            <h2 className="mb-4 text-xl font-semibold text-gray-100">
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
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-100">Next Drills</h2>
            <button
              className="text-sm text-blue-500 hover:underline"
              onClick={() => navigate('/drills')}
            >
              View all
            </button>
          </div>
          {loadingDrills ? (
            <p className="mt-4 text-center text-gray-500">Loading…</p>
          ) : (
            <NextDrillCarousel
              drills={drills}
              onStart={(id) => navigate(`/drills/play/${id}`)}
            />
          )}
        </section>

        {/* Recent Games */}
        <div className="mb-2 flex justify-between">
          <button
            className="flex items-center text-sm text-blue-400 hover:underline"
            onClick={() => setShowGames((v) => !v)}
          >
            Recent Games
            <ChevronDown
              className={`ml-1 h-4 w-4 transition-transform ${showGames ? 'rotate-180' : ''}`}
            />
          </button>
          <span className="text-xs text-gray-400">{games.length}</span>
        </div>
        {showGames && (
          <section>
            {recentGameId && (
              <div className="mb-4">
                <button
                  onClick={() => navigate(`/report/${recentGameId}`)}
                  className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Analyse Latest Game
                </button>
              </div>
            )}
            <GameList
              games={games}
              hero={username}
              isAnalysed={() => false}
              isLoading={() => loadingGames}
              onAction={(g) => navigate(`/report/${g.id}`)}
            />
          </section>
        )}
      </div>
    </div>
    <div className="pointer-events-none fixed inset-x-0 bottom-4 flex justify-center">
      <button
        onClick={() =>
          navigate(nextDrillId ? `/drills/play/${nextDrillId}` : '/drills')
        }
        className="pointer-events-auto rounded bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-green-700"
      >
        Start Next Drill
      </button>
    </div>
  );
}
