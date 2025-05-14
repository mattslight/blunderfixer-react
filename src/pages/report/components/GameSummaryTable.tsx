// src/pages/games/components/GameSummaryTable.tsx
import { useStickyValue } from '@/hooks/useStickyValue';
import type { Severity } from '@/lib/severity';
import { DOT_COLOR, scoreMove, TIME_TEXT_COLOR } from '@/lib/severity';
import type { AnalysisNode, GameRecord } from '@/types';
import { BarChart, Timer, TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import ListToggle from './ListToggle';

interface CombinedEntry {
  move: GameRecord['moves'][0];
  analysis: AnalysisNode;
  tags: Severity[];
  impact: number;
}

interface GameSummaryTableProps {
  combined: CombinedEntry[];
  onDrill?: (fen: string) => void;
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
      <div className="h-3 w-7 rounded-full bg-gray-300 transition-colors duration-200 peer-checked:bg-blue-500" />
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
  const formatLabel = (label: string, count: number) => {
    if (count === 1) return label;
    return label.endsWith('y') ? label.slice(0, -1) + 'ies' : label + 's';
  };
  return (
    <span className="flex items-center text-xs text-gray-500">
      <span className={`mr-1 inline-block h-2 w-2 rounded-full ${colour}`} />
      {count} {formatLabel(label, count)}
    </span>
  );
}

function CardView({
  entries,
  showAll,
  onDrill,
}: {
  entries: CombinedEntry[];
  showAll: boolean;
  onDrill?: (fen: string) => void;
}) {
  return (
    <>
      {entries.map((r, i, all) => {
        if (!showAll && r.tags.every((t) => t === 'none')) return null;
        const prev = all[i - 1];
        const prevMate = prev?.analysis.mateIn;
        const timeTag =
          r.tags.find((t) => t === 'timeImpulsive' || t === 'timeOveruse') ||
          'none';
        const timeColor = TIME_TEXT_COLOR[timeTag];
        return (
          <div
            key={i}
            className="mb-4 space-y-4 rounded-lg bg-gray-800 p-4 shadow-lg transition-transform hover:scale-102 hover:shadow-xl"
          >
            <div className="grid grid-cols-3 items-center">
              <div>
                <span className="block text-xs font-semibold tracking-wider text-green-500 uppercase">
                  Move {r.analysis.halfMoveIndex}
                </span>
              </div>
              <div className="text-center">
                <span className={`text-lg font-bold text-white`}>
                  {r.move.side === 'w' ? <WhitePiece /> : <BlackPiece />}{' '}
                  {r.move.san}
                </span>
              </div>
              <div className="text-right">
                {r.tags.map((t) =>
                  t !== 'none' ? (
                    <span
                      key={t}
                      className={`ml-1 inline-block rounded-full px-2.5 py-0.5 text-[8pt] font-semibold ${DOT_COLOR[t]} text-white`}
                    >
                      {t.toUpperCase()}
                    </span>
                  ) : null
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 items-center text-sm text-gray-300">
              <div className="flex items-center">
                <BarChart className="mr-1 text-blue-400" size={16} />
                {Math.abs(r.analysis.evalBefore) > 1000
                  ? `Mate in ${Math.abs(prevMate)}`
                  : r.analysis.evalBefore > 0
                    ? `+${r.analysis.evalBefore / 100}`
                    : r.analysis.evalBefore / 100}
              </div>
              <div
                className={`flex items-center justify-center font-medium ${r.impact < 0 ? 'text-red-500' : 'text-green-500'}`}
              >
                {Math.abs(r.impact) > 0 && (
                  <>
                    {r.impact > 0 ? (
                      <TrendingUp className="mr-1" size={16} />
                    ) : (
                      <TrendingDown className="mr-1" size={16} />
                    )}
                    {`${r.impact > 0 ? '+' : ''}${(r.impact / 100).toFixed(2)}`}
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
          </div>
        );
      })}
    </>
  );
}

function TableView({
  entries,
  showAll,
}: {
  entries: CombinedEntry[];
  showAll: boolean;
}) {
  return (
    <table className="mt-4 w-full table-auto text-sm">
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
        {entries.map((r, idx) => {
          if (!showAll && r.tags.every((t) => t === 'none')) return null;
          const timeTag =
            r.tags.find((t) => t === 'timeImpulsive' || t === 'timeOveruse') ||
            'none';
          return (
            <tr
              key={idx}
              className="border-t border-gray-800 hover:bg-gray-700"
            >
              <td className="px-2 py-1 text-center">
                {r.tags.map((t) =>
                  t !== 'none' ? (
                    <span
                      key={t}
                      className={`inline-block h-3 w-3 rounded-full ${DOT_COLOR[t]} mr-1`}
                    />
                  ) : null
                )}
              </td>
              <td className="px-2 py-1 text-gray-500">
                {r.analysis.halfMoveIndex}.
              </td>
              <td className="px-2 py-1">
                {r.move.side === 'w' ? <WhitePiece /> : <BlackPiece />}
              </td>
              <td className="px-2 py-1 text-white">{r.move.san}</td>
              <td
                className={`px-2 py-1 text-right font-medium ${r.impact < 0 ? 'text-red-500' : 'text-green-500'}`}
              >
                {`${r.impact > 0 ? '+' : ''}${(r.impact / 100).toFixed(2)}`}
              </td>
              <td
                className={`px-2 py-1 text-right font-medium ${TIME_TEXT_COLOR[timeTag]}`}
              >
                {r.move.timeSpent?.toFixed(1) ?? '–'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
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

  // compute top-5 by score
  const keyEntries = useMemo(() => {
    return [...combined]
      .filter((r) => !r.tags.includes('none'))
      .sort((a, b) => {
        const sa = scoreMove({
          severity: a.tags[0],
          impact: a.impact,
          evalBefore: a.analysis.evalBefore,
        });
        const sb = scoreMove({
          severity: b.tags[0],
          impact: b.impact,
          evalBefore: b.analysis.evalBefore,
        });
        return sb - sa;
      })
      .slice(0, 5)
      .sort((a, b) => a.analysis.halfMoveIndex - b.analysis.halfMoveIndex);
  }, [combined]);

  // full sorted list
  const sorted = useMemo(
    () =>
      [...combined].sort(
        (a, b) => a.analysis.halfMoveIndex - b.analysis.halfMoveIndex
      ),
    [combined]
  );

  // select entries
  const entries = showAll ? sorted : keyEntries;

  // recalc counts on full list
  const counts = sorted.reduce(
    (acc, r) => {
      r.tags.forEach((t) => {
        acc[t] = (acc[t] || 0) + 1;
      });
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

  const severityOrder: Severity[] = ['blunder', 'mistake', 'inaccuracy'];

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
        {severityOrder.map((sev) => (
          <LegendDot
            key={sev}
            colour={DOT_COLOR[sev]}
            count={counts[sev]}
            label={sev}
          />
        ))}
        {counts.timeImpulsive + counts.timeOveruse > 0 && (
          <span className="flex items-center text-xs text-gray-500">
            <span className="mr-0.5 inline-block h-2 w-2 rounded-full bg-cyan-500" />
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-purple-600" />
            {counts.timeImpulsive + counts.timeOveruse} time control
          </span>
        )}
      </div>

      {viewMode === 'card' ? (
        <CardView entries={entries} showAll={showAll} onDrill={onDrill} />
      ) : (
        <TableView entries={entries} showAll={showAll} />
      )}
    </>
  );
}

// helpers
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
