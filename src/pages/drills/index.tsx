// src/pages/DrillsPage.tsx
import { useProfile } from '@/hooks/useProfile';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { useStickyValue } from '@/hooks/useStickyValue';
import { Badge, TextInput } from 'flowbite-react';
import { RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import RangeSlider from 'react-range-slider-input';
import { useNavigate } from 'react-router-dom';
import DrillList from './components/DrillList';
import { useDrills } from './hooks/useDrills';

import 'react-range-slider-input/dist/style.css';

const PHASE_COLORS: Record<string, string> = {
  all: 'bg-gray-600',
  opening: 'bg-blue-700',
  middlegame: 'bg-purple-700',
  endgame: 'bg-rose-700',
};

export default function DrillsPage() {
  const navigate = useNavigate();
  const {
    profile: { username },
  } = useProfile();
  const { drills, loading, refresh } = useDrills(username);
  usePullToRefresh(refresh);

  // phase & search
  const [phaseFilter, setPhaseFilter] = useStickyValue<
    'all' | 'opening' | 'middlegame' | 'endgame'
  >('drillPhaseFilter', 'all');
  const [search, setSearch] = useState('');

  // 1) Define your thresholds (in pawns), and matching labels:
  const thresholdOptions = [0, 2.5, 3, 5, 10, 100, Infinity] as const;

  // 2) Start slider at the **last index** so default = All
  const [rangeIdx, setRangeIdx] = useStickyValue<[number, number]>(
    'drillRangeIdx',
    [0, thresholdOptions.length - 1]
  );

  // 3) Convert to centi-pawns once
  const [minIdx, maxIdx] = rangeIdx;
  const [minCutoff, maxCutoff] = [
    thresholdOptions[minIdx] * 100,
    thresholdOptions[maxIdx] * 100,
  ];

  // 4) Filter drills
  const filtered = useMemo(
    () =>
      drills.filter((d) => {
        // Phase filter (unchanged)
        const phase =
          d.ply <= 20 ? 'opening' : d.ply <= 50 ? 'middlegame' : 'endgame';
        if (phaseFilter !== 'all' && phase !== phaseFilter) return false;

        // Swing filter: show only drills with  minCutoff ≤ swing ≤ maxCutoff
        if (
          Math.abs(d.eval_swing) < minCutoff ||
          Math.abs(d.eval_swing) > maxCutoff
        )
          return false;

        // Search filter (case-insensitive against opponent and game ID)
        if (search) {
          const s = search.trim().toLowerCase();
          const inOpp = d.opponent_username.toLowerCase().includes(s);
          if (!inOpp) return false;
        }

        return true;
      }),
    [drills, phaseFilter, search, minCutoff, maxCutoff]
  );

  return (
    <div className="p-4 pt-8 2xl:ml-12">
      <div className="mx-auto max-w-lg space-y-4">
        <span className="inline-block py-0.5 text-xs font-semibold tracking-wider text-blue-400 uppercase">
          Drills
        </span>
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Phase badges */}
          <div className="flex flex-wrap items-center gap-2 text-gray-300">
            {(['all', 'opening', 'middlegame', 'endgame'] as const).map((p) => (
              <Badge
                key={p}
                onClick={() => setPhaseFilter(p)}
                className={`cursor-pointer rounded border-1 border-gray-800 px-3 py-2 ${phaseFilter == p && PHASE_COLORS[p]}`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Badge>
            ))}
          </div>
          {/* Refresh */}
          <button
            onClick={refresh}
            disabled={loading}
            className="xs:inline-flex hidden items-center rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300 hover:bg-gray-700 disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="xs:block ml-2 hidden">Refresh</span>
          </button>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          {/* Search */}
          <TextInput
            placeholder="Search opponent"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            className="min-w-40 flex-1"
          />

          {/* Discrete slider: left = hardest, right = All */}
          <div className="flex items-baseline space-x-2 py-2">
            <span className="text-sm font-medium text-gray-300">
              Blunder Size
            </span>
            <span className="text-xs font-bold text-gray-500">xs</span>
            <div className="w-50">
              <RangeSlider
                min={0}
                max={thresholdOptions.length - 1}
                step={1}
                value={rangeIdx}
                onInput={(vals) => setRangeIdx(vals as [number, number])}
              />
            </div>
            <span className="text-xs font-bold text-gray-500">lg</span>
          </div>
        </div>
        <div className="mt-10 text-sm text-gray-500">
          Showing {filtered.length} of {drills.length}
        </div>
        {/* List */}
        <DrillList
          drills={filtered}
          loading={loading}
          onStartDrill={(fen, orientation) =>
            navigate('/drills/play', {
              state: { fen, orientation },
            })
          }
        />
      </div>
    </div>
  );
}
