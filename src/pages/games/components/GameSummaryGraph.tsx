// src/components/GameSummary/GameSummaryGraph.tsx
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
} from 'recharts';
import type { AnalysisNode } from '@/types';

interface ChartEntry extends AnalysisNode {
  ply: number;
  raw: number;
  plot: number;
}

interface GraphProps {
  data: ChartEntry[];
  max: number;
}

export default function GameSummaryGraph({ data, max }: GraphProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis
          dataKey="ply"
          axisLine={false}
          tickLine={false}
          ticks={data.map((d) => d.ply).filter((p) => p % 5 === 0)}
          label={{ value: 'Move', position: 'insideBottom', offset: -5 }}
        />
        <YAxis
          domain={[-max, max]}
          ticks={[-max, -max / 2, 0, max / 2, max]}
          axisLine={false}
          tickLine={false}
          tick={false}
        />
        <Tooltip
          formatter={(_value, _name, { payload }) => [
            payload.raw.toFixed(2),
            'Eval',
          ]}
          labelFormatter={(ply) => `Move ${ply}`}
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
        <Bar dataKey="plot" isAnimationActive={false}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.raw >= 0 ? '#fff' : 'transparent'}
              stroke={entry.raw < 0 ? '#4F46E5' : 'none'}
              strokeWidth={1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
