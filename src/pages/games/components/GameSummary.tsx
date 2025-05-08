import { AnalysisNode, GameRecord } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export function GameSummary({
  game,
  analysis,
}: {
  game: GameRecord;
  analysis: AnalysisNode[];
}) {
  const MAX = 6; // ±6 pawn cap
  const TACTIC = 300; // 3-pawn threshold

  // chart data
  const chartData = analysis.map((a) => {
    const raw = a.evalCP / 100;
    const plot = Math.max(-MAX, Math.min(MAX, raw));
    return {
      ply: a.halfMoveIndex + 1,
      raw,
      plot,
      ...a,
    };
  });

  // 2) build a “combined” array that pairs each analysis node with its move
  const combined = analysis.map((a) => {
    const move = game.moves[a.halfMoveIndex];
    // if you want later: detect blunders per side
    const isBlunder =
      (move.side === 'w' && a.deltaCP <= -TACTIC) ||
      (move.side === 'b' && a.deltaCP >= TACTIC);
    return { a, move, isBlunder };
  });

  return (
    <article className="mb-6 rounded border border-gray-700 p-4">
      {/* ── Eval graph ── */}
      <div className="mb-6 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis
              dataKey="ply"
              axisLine={false}
              tickLine={false}
              ticks={chartData.map((d) => d.ply).filter((p) => p % 5 === 0)}
              label={{ value: 'Move', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              domain={[-MAX, MAX]}
              ticks={[-MAX, -MAX / 2, 0, MAX / 2, MAX]}
              axisLine={false}
              tickLine={false}
              tick={false}
            />
            <Tooltip
              formatter={(_v, _n, { payload }) => [
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
              {chartData.map((entry, i) => (
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
      </div>

      <header className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">
            {game.meta.players.white.player.username} vs{' '}
            {game.meta.players.black.player.username}
          </h3>
          <p className="text-sm text-gray-400">
            {game.meta.date} • {game.meta.timeControl}+{game.meta.increment}s •{' '}
            {game.meta.timeClass}
          </p>
        </div>
        <div className="text-sm">Blunders (Δ≤–300): coming soon</div>
      </header>

      <table className="w-full table-auto text-sm">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-2 py-1 text-left">Move</th>
            <th className="px-2 py-1 text-right">Eval</th>
            <th className="px-2 py-1 text-right">Δ Eval</th>
            <th className="px-2 py-1 text-right">Time</th>
            <th className="px-2 py-1 text-right">Depth</th>
          </tr>
        </thead>
        <tbody>
          {combined.map(({ move, a, isBlunder }, i) => (
            <tr
              key={i}
              className={`border-t border-gray-700 ${
                isBlunder ? 'bg-red-900' : ''
              }`}
            >
              <td className="px-2 py-1">
                {move.moveNumber}
                {move.side}. {move.san}
              </td>
              <td className="px-2 py-1 text-right">
                {a.evalCP > 0 ? `+${a.evalCP}` : a.evalCP}
              </td>
              <td
                className={`px-2 py-1 text-right ${
                  a.deltaCP <= -TACTIC
                    ? 'text-red-400'
                    : a.deltaCP >= TACTIC
                      ? 'text-green-400'
                      : ''
                }`}
              >
                {a.deltaCP > 0 ? `+${a.deltaCP}` : a.deltaCP}
              </td>
              <td className="px-2 py-1 text-right">
                {move.timeSpent != null ? `${move.timeSpent.toFixed(1)}s` : '–'}
              </td>
              <td className="px-2 py-1 text-right">{a.depth}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
