// src/components/GameSummary/GameSummaryGraph.tsx
import {
  Area,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
  handlePositionSelect: (halfMoveIndex: number) => void;
}

export default function EvalGraph({
  data,
  max,
  handlePositionSelect,
}: GraphProps) {
  // split into two fields so we can color above/below separately
  const enriched = data.map((d) => ({
    ...d,
    positive: d.plot > 0 ? d.plot : 0,
    negative: d.plot < 0 ? d.plot : 0,
  }));

  return (
    <div>
      <h3 className="mb-8 block text-center text-xs font-semibold tracking-wider text-stone-600 uppercase">
        Eval
      </h3>
      <div className="-ml-14 h-30">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={enriched}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            onClick={(data: any) => {
              //console.log('click', data);
              const ply = data?.activeLabel;
              if (ply !== undefined) {
                handlePositionSelect(ply);
              }
            }}
          >
            <XAxis
              dataKey="ply"
              axisLine={false}
              tickLine={false}
              tick={false}
            />
            <YAxis
              domain={[-max, max]}
              axisLine={false}
              tickLine={false}
              tick={false}
            />
            <Tooltip
              content={({ payload, label }) => {
                if (!payload || !payload.length) return null;
                const pt =
                  payload.find((p) => p.dataKey === 'plot') || payload[0];
                const { raw, mateIn } = pt.payload;

                return (
                  <div className="rounded bg-stone-800 p-2 text-white">
                    <div>{`Move ${label}`}</div>
                    {mateIn !== undefined && Math.abs(mateIn) > 0 ? (
                      <div>{`Mate in ${Math.abs(mateIn)}`}</div>
                    ) : (
                      <div>{raw.toFixed(2)}</div>
                    )}
                  </div>
                );
              }}
            />

            {/* Area above 0 */}
            <Area
              type="monotone"
              dataKey="positive"
              baseLine={0}
              stroke="#ffffff"
              fill="#ffffff"
              isAnimationActive={true}
            />
            {/* Area below 0 */}
            <Area
              type="monotone"
              dataKey="negative"
              baseLine={0}
              stroke="#4F46E5"
              fill="#4F46E5"
              isAnimationActive={true}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
