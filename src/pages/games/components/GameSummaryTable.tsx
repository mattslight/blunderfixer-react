import { useStickyValue } from '@/hooks/useStickyValue';
import type { Severity } from '@/lib/severity';
import { INACCURACY } from '@/lib/severity';
import type { AnalysisNode, GameRecord } from '@/types';
import { BarChart, Timer, TrendingDown, TrendingUp } from 'lucide-react';
import ListToggle from './ListToggle';

interface CombinedEntry {
  move: GameRecord['moves'][0];
  analysis: AnalysisNode;
  severity: Severity;
  impact: number;
}

interface GameSummaryTableProps {
  combined: CombinedEntry[];
  onDrill?: (fen: string) => void;
}

export default function GameSummaryTable({
  combined,
  onDrill,
}: GameSummaryTableProps) {
  const [showAll, setShowAll] = useStickyValue<boolean>('showAllMoves', false);
  const [viewMode, setViewMode] = useStickyValue<'card' | 'table'>(
    'viewMode',
    'card'
  );

  const counts = combined.reduce(
    (acc, { severity }) => {
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    },
    {
      blunder: 0,
      mistake: 0,
      inaccuracy: 0,
      timeImpulsive: 0,
      timeOveruse: 0,
      none: 0,
    } as Record<Severity, number>
  );

  const dotColour: Record<Severity, string> = {
    blunder: 'bg-red-600',
    mistake: 'bg-orange-600',
    inaccuracy: 'bg-yellow-500',
    timeImpulsive: 'bg-cyan-500',
    timeOveruse: 'bg-purple-600',
    none: 'bg-gray-800',
  };

  const fmtDelta = (d: number) => (d > 0 ? `+${d}` : `${d}`);

  return (
    <>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <span className="block text-xs font-semibold tracking-wider text-green-500 uppercase">
            Review
          </span>
          <h2 className="mb-2 text-2xl font-bold text-white">Key Moves</h2>
          <span className="mr-2 text-sm text-gray-600">Show all</span>
          <ToggleSwitch
            checked={showAll}
            onChange={() => setShowAll((v) => !v)}
          />
        </div>
        <div className="flex flex-col items-end justify-end">
          <ListToggle viewMode={viewMode} onChange={setViewMode} />
        </div>
      </div>

      <div className="mb-2 flex flex-wrap items-center space-x-4 px-2 text-xs text-gray-500">
        <LegendDot colour="bg-red-500" count={counts.blunder} label="blunder" />
        <LegendDot
          colour="bg-orange-500"
          count={counts.mistake}
          label="mistake"
        />
        <LegendDot
          colour="bg-yellow-400"
          count={counts.inaccuracy}
          label="inaccuracy"
        />
        {counts.timeImpulsive + counts.timeOveruse > 0 && (
          <span className="flex items-center">
            <span className="-mr-1 inline-block h-2 w-2 rounded-full bg-cyan-500" />
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-purple-600" />
            {counts.timeImpulsive + counts.timeOveruse} time control
          </span>
        )}
      </div>

      {viewMode === 'card' &&
        combined.map((r, i, all) => {
          if (!showAll && r.severity === 'none') return null;
          const prev = all[i - 1];
          const prevMateIn = prev?.analysis.mateIn;
          const timeColor =
            r.severity === 'timeImpulsive'
              ? 'text-cyan-400'
              : r.severity === 'timeOveruse'
                ? 'text-purple-500'
                : 'text-gray-500';

          return (
            <div
              key={i}
              className="mb-4 space-y-4 rounded-lg bg-gray-800 p-4 shadow-lg transition duration-200 ease-in-out hover:scale-102 hover:shadow-xl"
            >
              <div className="grid grid-cols-3 items-center">
                <div className="text-left">
                  <span className="block text-xs font-semibold tracking-wider text-green-600 uppercase">
                    Move {r.analysis.halfMoveIndex}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold text-white">
                    {r.move.side === 'w' ? <WhitePiece /> : <BlackPiece />}{' '}
                    {r.move.san}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`-mr-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${dotColour[r.severity]} text-white`}
                  >
                    {r.severity !== 'none' && r.severity.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 items-center text-sm text-gray-300">
                <div className="flex items-center">
                  <BarChart className="mr-1 text-blue-400" size={16} />
                  {Math.abs(r.analysis.evalBefore) > 1000
                    ? `Mate in ${prevMateIn}`
                    : r.analysis.evalBefore > 0
                      ? `+${r.analysis.evalBefore}`
                      : r.analysis.evalBefore}
                </div>
                <div
                  className={`flex items-center justify-center font-medium ${r.impact < 0 ? 'text-red-500' : 'text-green-500'}`}
                >
                  {Math.abs(r.impact) > INACCURACY && (
                    <>
                      {r.impact > 0 ? (
                        <TrendingUp className="mr-1" size={16} />
                      ) : (
                        <TrendingDown className="mr-1" size={16} />
                      )}
                      {r.impact >= 1000
                        ? `mate in ${r.analysis.mateIn}`
                        : r.impact <= -1000
                          ? 'missed mate'
                          : fmtDelta(r.impact)}
                    </>
                  )}
                </div>
                <div
                  className={`flex items-center justify-end font-medium ${timeColor}`}
                >
                  <Timer className="mr-1" size={16} />
                  {r.move.timeSpent?.toFixed(1) ?? '–'}s
                </div>
              </div>

              {onDrill && (
                <button
                  className="text-xs text-blue-400 underline hover:text-blue-300"
                  onClick={() => onDrill(r.analysis.fen)}
                >
                  Drill this position
                </button>
              )}
            </div>
          );
        })}

      {viewMode === 'table' && (
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-2 py-1" />
              <th className="px-2 py-1 text-left">Move</th>
              <th className="px-2 py-1" />
              <th className="px-2 py-1 text-left" />
              <th className="px-2 py-1 text-right">Impact</th>
              <th className="px-2 py-1 text-right">
                Time <span className="font-normal text-gray-400">(s)</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {combined.map(({ move, analysis, severity, impact }, idx) => {
              if (!showAll && severity === 'none') return null;
              const timeColor =
                severity === 'timeImpulsive'
                  ? 'text-cyan-400'
                  : severity === 'timeOveruse'
                    ? 'text-purple-500'
                    : 'text-gray-500';

              return (
                <tr
                  key={idx}
                  className="border-t border-gray-800 hover:bg-gray-700"
                >
                  <td className="px-2 py-1">
                    <span
                      className={`inline-block h-4 w-4 rounded-full ${dotColour[severity]}`}
                    />
                  </td>
                  <td className="px-2 py-1 text-gray-500">
                    {analysis.halfMoveIndex}.
                  </td>
                  <td className="px-2 py-1">
                    {move.side === 'w' ? <WhitePiece /> : <BlackPiece />}
                  </td>
                  <td className="px-2 py-1">{move.san}</td>
                  <td
                    className={`px-2 py-1 text-right font-medium ${impact < 0 ? 'text-red-500' : 'text-green-500'}`}
                  >
                    {impact >= 1000
                      ? `mate in ${analysis.mateIn}`
                      : impact <= -1000
                        ? 'missed mate'
                        : fmtDelta(impact)}
                  </td>
                  <td
                    className={`px-2 py-1 text-right font-medium ${timeColor}`}
                  >
                    {move.timeSpent?.toFixed(1) ?? '–'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div className="h-3 w-7 rounded-full bg-gray-300 transition-colors duration-200 peer-checked:bg-blue-500 dark:bg-gray-600" />
      <div className="absolute left-0.25 h-3.5 w-3.5 rounded-full bg-gray-200 transition-transform duration-200 ease-in-out peer-checked:translate-x-3" />
    </label>
  );
}

function LegendDot({
  colour,
  count,
  label,
}: {
  colour: string;
  count: number;
  label: string;
}) {
  return (
    <span className="flex items-center">
      <span className={`mr-1 inline-block h-2 w-2 rounded-full ${colour}`} />{' '}
      {count} {label}
      {count !== 1 ? 's' : ''}
    </span>
  );
}

function BlackPiece() {
  return (
    <span className="text-xl text-black [text-shadow:-0.5px_-0.5px_0_#4F46E5,0.5px_-0.5px_0_#4F46E5,-0.5px_0.5px_0_#4F46E5,0.5px_0.5px_0_#4F46E5]">
      ♞
    </span>
  );
}
function WhitePiece() {
  return <span className="text-xl text-white">♞</span>;
}
