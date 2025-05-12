// src/pages/games/components/GameSummaryTable.tsx
import ToggleSwitch from '@/components/ToggleSwitch';
import { useStickyValue } from '@/hooks/useStickyValue';
import type { AnalysisNode, GameRecord } from '@/types';

type Severity = 'blunder' | 'mistake' | 'inaccuracy' | 'none';

interface CombinedEntry {
  move: GameRecord['moves'][0];
  analysis: AnalysisNode;
  severity: Severity;
  impact: number;
}

interface Props {
  combined: CombinedEntry[];
}

export default function GameSummaryTable({ combined }: Props) {
  const [showAll, setShowAll] = useStickyValue<boolean>('showAllMoves', false);

  // tally severities
  const counts = combined.reduce(
    (acc, { severity }) => {
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    },
    { blunder: 0, mistake: 0, inaccuracy: 0, none: 0 } as Record<
      Severity,
      number
    >
  );

  // filter out non‐hero / non‐critical moves
  const rows = showAll
    ? combined
    : combined.filter((r) => r.severity !== 'none');

  // severity → dot colour
  const dotColour: Record<Severity, string> = {
    blunder: 'bg-red-500',
    mistake: 'bg-orange-500',
    inaccuracy: 'bg-yellow-400',
    none: 'bg-gray-800',
  };

  // fast / slow time highlighting
  const timeClass = (t: number) =>
    t < 2 ? 'text-yellow-500' : t > 10 ? 'text-red-500' : '';

  // format ΔEval, placeholder for large swings
  const fmtDelta = (d: number) => {
    if (d >= 1000) return 'Mate';
    if (d <= -1000) return 'Missed mate';
    return d > 0 ? `+${d}` : `${d}`;
  };

  return (
    <>
      {/* title */}
      <div className="mb-4">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-green-500 uppercase">
          Analysis
        </span>
        <h2 className="mb-2 text-2xl font-bold text-white">Key Moves</h2>
      </div>

      {/* legend & toggle */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-300">
          <LegendDot
            colour="bg-red-500"
            label={`${counts.blunder} blunder${counts.blunder !== 1 ? 's' : ''}`}
          />
          <LegendDot
            colour="bg-orange-500"
            label={`${counts.mistake} mistake${counts.mistake !== 1 ? 's' : ''}`}
          />
          <LegendDot
            colour="bg-yellow-400"
            label={`${counts.inaccuracy} inaccurac${counts.inaccuracy !== 1 ? 'ies' : 'y'}`}
          />
        </div>
        <ToggleSwitch
          checked={showAll}
          onChange={() => setShowAll((v) => !v)}
          label="All moves"
        />
      </div>

      {/* moves table */}
      <table className="w-full table-auto text-sm">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-2 py-1" />
            <th className="px-2 py-1 text-left">Ply</th>
            <th className="px-2 py-1 text-left">Move</th>
            <th className="px-2 py-1 text-right">Eval Before</th>
            <th className="px-2 py-1 text-right">Move Impact</th>
            <th className="px-2 py-1 text-right">Ratio</th>
            <th className="px-2 py-1 text-right">Ratio 2</th>
            <th className="px-2 py-1 text-right">Time spent (s)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ move, analysis, severity, impact }, idx) => (
            <tr key={idx} className="border-t border-gray-700">
              <td className="px-2 py-1">
                {dotColour[severity] !== 'none' && (
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${dotColour[severity]}`}
                  />
                )}
              </td>
              <td className="px-2 py-1">{analysis.halfMoveIndex}</td>
              <td className="px-2 py-1">
                {move.side}. {move.san}
              </td>
              <td className="px-2 py-1 text-right">
                {analysis.evalBefore > 0
                  ? `+${analysis.evalBefore}`
                  : analysis.evalBefore}
              </td>
              <td
                className={`px-2 py-1 text-right ${
                  severity === 'blunder'
                    ? 'text-red-400'
                    : severity === 'mistake'
                      ? 'text-orange-400'
                      : severity === 'inaccuracy'
                        ? 'text-yellow-400'
                        : ''
                }`}
              >
                {fmtDelta(impact)}
              </td>
              <td
                className={`px-2 py-1 text-right ${
                  severity === 'blunder'
                    ? 'text-red-400'
                    : severity === 'mistake'
                      ? 'text-orange-400'
                      : severity === 'inaccuracy'
                        ? 'text-yellow-400'
                        : ''
                }`}
              >
                {Math.abs(
                  Math.round(impact / Math.abs(analysis.evalBefore + 100))
                )}
              </td>
              <td
                className={`px-2 py-1 text-right ${
                  severity === 'blunder'
                    ? 'text-red-400'
                    : severity === 'mistake'
                      ? 'text-orange-400'
                      : severity === 'inaccuracy'
                        ? 'text-yellow-400'
                        : ''
                }`}
              >
                {Math.abs(
                  Math.round(
                    impact /
                      (Math.log1p(Math.abs(analysis.evalBefore)) * 50 + 50)
                  )
                )}
              </td>
              <td
                className={`px-2 py-1 text-right ${
                  move.timeSpent != null ? timeClass(move.timeSpent) : ''
                }`}
              >
                {move.timeSpent != null ? move.timeSpent.toFixed(1) : '–'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

// small legend helper
function LegendDot({ colour, label }: { colour: string; label: string }) {
  return (
    <div className="flex items-center space-x-1">
      <span className={`inline-block h-2 w-2 rounded-full ${colour}`} />
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}
