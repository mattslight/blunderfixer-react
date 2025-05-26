// src/pages/games/components/TimeUsageChart.tsx
import { useStickyValue } from '@/hooks/useStickyValue';
import { useMemo } from 'react';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type TimePoint = { move: number; heroTime: number; oppTime: number };

const GRAPH_COLOURS = {
  opponent: {
    htmlString: 'oklch(55% 0.20 310)',
    twClass: 'bg-[oklch(55%_0.20_310)]',
  },
  hero: {
    htmlString: 'oklch(75% 0.20 200)',
    twClass: 'bg-cyan-600',
  },
};

export default function TimeUsageChart({
  data,
  game,
  heroSide,
  handlePositionSelect,
}: {
  data: TimePoint[];
  game?: any;
  heroSide?: string;
  handlePositionSelect: (halfMoveIndex: number) => void;
}) {
  // determine if hero is white
  const heroIsWhite = useMemo(() => {
    return Boolean(
      game && heroSide && game.moves?.[0]?.side === 'w' && heroSide === 'w'
    );
  }, [game, heroSide]);

  // compute remaining-time burndown after each full move
  const burnData = useMemo(() => {
    let heroRem = game?.meta.timeControl ?? 0;
    let oppRem = game?.meta.timeControl ?? 0;
    const inc = game?.meta.increment ?? 0;
    return data.map((pt) => {
      heroRem = heroRem - pt.heroTime + inc;
      oppRem = oppRem - pt.oppTime + inc;
      return { move: pt.move, heroRem, oppRem };
    });
  }, [data, game]);

  // precompute bar configs based on hero side
  const barSeries = useMemo(() => {
    const configs = heroIsWhite
      ? [
          {
            dataKey: 'heroTime',
            name: 'You',
            fill: GRAPH_COLOURS.hero.htmlString,
          },
          {
            dataKey: 'oppTime',
            name: 'Opp.',
            fill: GRAPH_COLOURS.opponent.htmlString,
          },
        ]
      : [
          {
            dataKey: 'oppTime',
            name: 'Opp.',
            fill: GRAPH_COLOURS.opponent.htmlString,
          },
          {
            dataKey: 'heroTime',
            name: 'You',
            fill: GRAPH_COLOURS.hero.htmlString,
          },
        ];
    return configs;
  }, [heroIsWhite]);

  // sticky toggle between per-move bars and burndown areas
  const [mode, setMode] = useStickyValue<'per-move' | 'burndown'>(
    'timeChartMode',
    'burndown'
  );

  return (
    <>
      {/* mode toggle */}
      <div className="flex flex-col items-center">
        <h3 className="mb-2 block text-center text-xs font-semibold tracking-wider text-gray-600 uppercase">
          Time
        </h3>
        {/* mode toggle segmented control */}
        <div
          role="group"
          aria-label="Time Chart Mode"
          className="mx-auto inline-flex overflow-hidden rounded-lg border border-gray-700"
        >
          <button
            onClick={() => setMode('burndown')}
            className={`block flex-1 cursor-pointer px-4 py-1.5 text-center text-xs font-semibold tracking-wider transition-colors focus:outline-none ${
              mode === 'burndown'
                ? 'bg-gray-800 text-gray-400'
                : 'bg-transparent text-gray-500'
            } border-r border-gray-700`}
          >
            burndown
          </button>
          <button
            onClick={() => setMode('per-move')}
            className={`block flex-1 cursor-pointer px-4 py-1.5 text-center text-xs font-semibold tracking-wider transition-colors focus:outline-none ${
              mode === 'per-move'
                ? 'bg-gray-800 text-gray-400'
                : 'bg-transparent text-gray-500'
            }`}
          >
            per-move
          </button>
        </div>
      </div>

      <div className="-mr-6 -ml-14 h-30">
        <ResponsiveContainer width="100%" height="100%">
          {mode === 'per-move' ? (
            <BarChart
              data={data}
              barCategoryGap="5%"
              barGap={2}
              margin={{ right: 24 }}
            >
              <XAxis
                dataKey="move"
                axisLine={true}
                tickLine={false}
                tick={false}
                stroke="oklch(32.6% 0.03 256.802)"
              />
              <YAxis axisLine={false} tickLine={false} tick={false} />
              <Tooltip
                shared={false}
                // custom content function gives you full control
                content={({ payload, active }) => {
                  if (!active || !payload || !payload.length) {
                    return null;
                  }
                  // payload[0] is the hovered bar
                  const { dataKey, value, payload: pt } = payload[0];
                  // full-move number
                  const mv = pt.move;
                  // which half-move (ply) is this?
                  const isHeroBar = dataKey === 'heroTime';
                  const ply = heroIsWhite
                    ? isHeroBar
                      ? mv * 2 - 1
                      : mv * 2
                    : isHeroBar
                      ? mv * 2
                      : mv * 2 - 1;

                  return (
                    <div
                      className="rounded bg-gray-800 p-2 text-white"
                      style={{ pointerEvents: 'none' }}
                    >
                      <div className="font-semibold">{`Ply ${ply}`}</div>
                      <div>
                        {payload[0].name}: {Number(value).toFixed(1)}s
                      </div>
                    </div>
                  );
                }}
                cursor={{ fill: 'rgba(255,255,255,0.1)' }}
              />
              {barSeries.map((s) => (
                <Bar
                  key={s.dataKey}
                  dataKey={s.dataKey}
                  name={s.name}
                  fill={s.fill}
                  onClick={({ payload }: any) => {
                    const mv = payload.move;
                    let halfMove: number;

                    // hero as white: heroTime=odd ply, oppTime=even ply
                    // hero as black: heroTime=even ply, oppTime=odd ply
                    if (s.dataKey === 'heroTime') {
                      halfMove = heroIsWhite ? mv * 2 - 1 : mv * 2;
                    } else {
                      halfMove = heroIsWhite ? mv * 2 : mv * 2 - 1;
                    }

                    handlePositionSelect(halfMove);
                  }}
                />
              ))}
            </BarChart>
          ) : (
            <AreaChart
              data={burnData}
              margin={{ top: 0, right: 24, bottom: 0, left: 0 }}
              onClick={(data: any) => {
                //console.log('click', data);
                const ply = data?.activeLabel * 2;
                if (ply !== undefined) {
                  handlePositionSelect(ply);
                }
              }}
            >
              <XAxis
                dataKey="move"
                axisLine={true}
                tickLine={false}
                tick={false}
                stroke="oklch(32.6% 0.03 256.802)"
              />
              <YAxis axisLine={false} tickLine={false} tick={false} />
              <Tooltip
                formatter={(v: number) => `${v.toFixed(0)}s`}
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
              <Area
                type="monotone"
                dataKey="heroRem"
                name="You"
                stroke={GRAPH_COLOURS.hero.htmlString}
                //fill={GRAPH_COLOURS.hero.htmlString}
                fillOpacity={0}
              />
              <Area
                type="monotone"
                dataKey="oppRem"
                name="Opp."
                stroke={GRAPH_COLOURS.opponent.htmlString}
                //fill={GRAPH_COLOURS.opponent.htmlString}
                fillOpacity={0}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* legend */}
      <div className="-mt-8 mb-16 flex justify-center text-xs font-semibold text-gray-500">
        <span className="mr-2 flex items-center">
          <span
            className={`mr-1 h-2 w-2 rounded-full ${GRAPH_COLOURS.hero.twClass}`}
          />
          You
        </span>
        <span className="flex items-center">
          <span
            className={`mr-1 h-2 w-2 rounded-full ${GRAPH_COLOURS.opponent.twClass}`}
          />
          Opponent
        </span>
      </div>
    </>
  );
}
