// src/pages/games/components/TimeUsageChart.tsx
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// after your existing `analysis` + `heroSide` logic…
type TimePoint = { move: number; heroTime: number; oppTime: number };

export default function TimeUsageChart({
  data,
  game,
  heroSide,
}: {
  data: TimePoint[];
  game?: any;
  heroSide?: string;
}) {
  // Defensive: default to false if game or heroSide not provided
  let heroIsWhite = false;
  if (game && heroSide) {
    heroIsWhite = game.moves && game.moves[0]?.side === 'w' && heroSide === 'w';
  }

  return (
    <>
      <h3 className="mb-1 flex justify-center text-xs font-semibold text-gray-600 uppercase">
        Time per Move
      </h3>
      <div className="-mr-6 -ml-14 h-40">
        {heroIsWhite && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              barCategoryGap="1%" // ← leave half the category empty
              barGap={0} // ← 2px between the two bars
            >
              <XAxis
                dataKey="move"
                axisLine={false}
                tickLine={false}
                tick={false}
              />
              <YAxis axisLine={false} tickLine={false} tick={false} />
              <Tooltip
                formatter={(v: number) => `${v.toFixed(1)}s`}
                contentStyle={{
                  backgroundColor: '#1f1f1f',
                  borderColor: '#333',
                  borderRadius: 4,
                  padding: 8,
                  color: '#fff',
                }}
                itemStyle={{ color: '#fff' }}
                cursor={{ fill: 'rgba(255,255,255,0.1)' }}
              />

              <Bar
                dataKey="heroTime"
                name="You"
                fill="#38bdf8"
                isAnimationActive
              />
              <Bar
                dataKey="oppTime"
                name="Opp."
                fill="#a78bfa"
                isAnimationActive
              />
            </BarChart>
          </ResponsiveContainer>
        )}
        {!heroIsWhite && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 0, right: 10, bottom: 0, left: 0 }}
              barCategoryGap="5%" // ← leave half the category empty
              barGap={2} // ← 2px between the two bars
            >
              <XAxis
                dataKey="ply"
                axisLine={false}
                tickLine={false}
                tick={false}
              />
              <YAxis axisLine={false} tickLine={false} tick={false} />
              <Tooltip
                formatter={(v: number) => `${v.toFixed(1)}s`}
                contentStyle={{
                  backgroundColor: '#1f1f1f',
                  borderColor: '#333',
                  borderRadius: 4,
                  padding: 8,
                  color: '#fff',
                }}
                itemStyle={{ color: '#fff' }}
                cursor={{ fill: 'rgba(255,255,255,0.1)' }}
              />
              <Bar
                dataKey="oppTime"
                name="Opp."
                fill="#a78bfa"
                isAnimationActive
              />
              <Bar
                dataKey="heroTime"
                name="You"
                fill="#38bdf8"
                isAnimationActive
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="-mt-8 mb-16 flex justify-center text-xs font-semibold text-gray-600">
        <span className="mr-2 flex items-center">
          <span className="mr-1 h-2 w-2 rounded-full bg-sky-500" />
          You
        </span>
        <span className="flex items-center">
          <span className="mr-1 h-2 w-2 rounded-full bg-purple-500" />
          Opponent
        </span>
      </div>
    </>
  );
}
