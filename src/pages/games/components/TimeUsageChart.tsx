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

export default function TimeUsageChart({ data }: { data: TimePoint[] }) {
  return (
    <div className="mb-6 -ml-14 h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, bottom: 5, left: 0 }}
        >
          <XAxis dataKey="ply" axisLine={false} tickLine={false} tick={false} />
          <YAxis axisLine={false} tickLine={false} tick={false} />
          <Tooltip formatter={(v: number) => `${v.toFixed(1)}s`} />
          <Bar dataKey="heroTime" name="You" fill="#38bdf8" />
          <Bar dataKey="oppTime" name="Opp." fill="#a78bfa" />{' '}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
