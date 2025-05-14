// src/pages/games/components/SummaryTable.tsx
import { useStickyValue } from '@/hooks/useStickyValue';
import type { Severity } from '@/lib/severity';
import { DOT_COLOR, scoreMove } from '@/lib/severity';
import type { AnalysisNode, GameRecord } from '@/types';
import { useMemo } from 'react';
import TableView from './TableView';

export interface CombinedEntry {
  move: GameRecord['moves'][0];
  analysis: AnalysisNode;
  tags: Severity[];
  impact: number;
}

interface GameSummaryTableProps {
  combined: CombinedEntry[];
  onClick: (halfMoveIndex: number) => void;
  pgn: string;
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

export default function GameSummaryTable({
  combined,
  onClick,
  pgn,
}: GameSummaryTableProps) {
  const [showAll, setShowAll] = useStickyValue<boolean>('showAllMoves', false);
  const [viewMode, setViewMode] = useStickyValue<'stack' | 'table'>(
    'viewMode',
    'stack'
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
      <div className="mb-4 gap-4">
        <div>
          <span className="block text-xs font-semibold tracking-wider text-green-500 uppercase">
            Review
          </span>
          <h2 className="mb-2 text-2xl font-bold text-white">Critical Moves</h2>
          <span className="mr-2 text-sm text-gray-600">Show all</span>
          <ToggleSwitch
            checked={showAll}
            onChange={() => setShowAll((v) => !v)}
          />
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

      <TableView entries={entries} showAll={showAll} onClick={onClick} />
    </>
  );
}
