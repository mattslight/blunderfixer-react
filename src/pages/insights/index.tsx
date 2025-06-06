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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useProfile } from '@/hooks/useProfile';
import { parseChessComGame } from '@/lib/chessComParser';
import RecentDrillList from '@/pages/drills/components/RecentDrillList';
import { useRecentDrills } from '@/pages/drills/hooks/useRecentDrills';
import GameList from '@/pages/games/components/GameList';
import { useRecentGames } from '@/pages/games/hooks/useRecentGames';

export default function InsightsPage() {
  const navigate = useNavigate();
  const {
    profile: { username },
  } = useProfile();

  const { drills, loading: loadingDrills } = useRecentDrills(username, {
    limit: 3,
  });
  const { games: rawGames, loading: loadingGames } = useRecentGames(
    username,
    3
  );

  const games = Array.isArray(rawGames) ? rawGames.map(parseChessComGame) : [];

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
        </header>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          <div className="rounded bg-gray-800 p-4 text-center">
            <p className="text-2xl font-semibold text-blue-400">123</p>
            <p className="text-sm text-gray-300">Blunders Fixed</p>
          </div>
          <div className="rounded bg-gray-800 p-4 text-center">
            <p className="text-2xl font-semibold text-green-400">64%</p>
            <p className="text-sm text-gray-300">Tactic Accuracy</p>
          </div>
          <div className="rounded bg-gray-800 p-4 text-center">
            <p className="text-2xl font-semibold text-purple-400">75%</p>
            <p className="text-sm text-gray-300">Winning Openings</p>
          </div>
          <div className="rounded bg-gray-800 p-4 text-center">
            <p className="text-2xl font-semibold text-fuchsia-400">48%</p>
            <p className="text-sm text-gray-300">Endgame Wins</p>
          </div>
          <div className="rounded bg-gray-800 p-4 text-center">
            <p className="text-2xl font-semibold text-amber-400">58%</p>
            <p className="text-sm text-gray-300">Win Rate (White)</p>
          </div>
          <div className="rounded bg-gray-800 p-4 text-center">
            <p className="text-2xl font-semibold text-indigo-400">42%</p>
            <p className="text-sm text-gray-300">Win Rate (Black)</p>
          </div>
        </section>

        {/* Charts */}
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
          <RecentDrillList
            drills={drills}
            loading={loadingDrills}
            onPlay={(id) => navigate(`/drills/play/${id}`)}
          />
        </section>

        {/* Recent Games */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-100">
              Recent Games
            </h2>
            <button
              className="text-sm text-blue-500 hover:underline"
              onClick={() => navigate('/games')}
            >
              View all
            </button>
          </div>
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
  );
}
