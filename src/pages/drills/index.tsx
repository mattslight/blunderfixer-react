// src/pages/DrillsPage.tsx
import { useProfile } from '@/hooks/useProfile';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { Badge, RangeSlider, TextInput } from 'flowbite-react';
import { RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DrillList from './components/DrillList';
import { useDrills } from './hooks/useDrills';

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

  useEffect(() => {
    refresh();
  }, [refresh]);

  // phase & search
  const [phaseFilter, setPhaseFilter] = useState<
    'all' | 'opening' | 'middlegame' | 'endgame'
  >('all');
  const [search, setSearch] = useState('');

  // 1) Define your thresholds (in pawns), and matching labels:
  const thresholdOptions = [2.5, 3, 5, 10, Infinity] as const;
  const thresholdLabels = ['< 2', '< 3', '< 5', '< 10', 'All'] as const;

  // 2) Start slider at the **last index** so default = All
  const [thrIdx, setThrIdx] = useState(thresholdOptions.length - 1);

  // 3) Convert to centi-pawns once
  const cutoffCenti = useMemo(() => thresholdOptions[thrIdx] * 100, [thrIdx]);

  // 4) Filter drills
  const filtered = useMemo(
    () =>
      drills.filter((d) => {
        // Phase filter (unchanged)
        const moveNo = Math.ceil(d.ply / 2);
        const phase =
          moveNo <= 14 ? 'opening' : moveNo <= 30 ? 'middlegame' : 'endgame';
        if (phaseFilter !== 'all' && phase !== phaseFilter) return false;

        // Swing filter: show only drills with swing ≤ cutoff
        if (Math.abs(d.eval_swing) > cutoffCenti) return false;

        // Search filter
        if (search) {
          const inId = d.game_id.includes(search);
          const inOpp = (d.opponent || '').includes(search);
          if (!inId && !inOpp) return false;
        }
        return true;
      }),
    [drills, phaseFilter, cutoffCenti, search]
  );

  return (
    <div className="p-4 pt-8 2xl:ml-12">
      <div className="mx-auto max-w-lg space-y-4">
        <span className="inline-block py-0.5 text-xs font-semibold tracking-wider text-blue-400 uppercase">
          Your Drills ({filtered.length}/{drills.length})
        </span>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Phase badges */}
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'opening', 'middlegame', 'endgame'] as const).map((p) => (
              <Badge
                key={p}
                onClick={() => setPhaseFilter(p)}
                className={`cursor-pointer rounded ${phaseFilter == p && PHASE_COLORS[p]}`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Badge>
            ))}
          </div>
          {/* Refresh */}
          <button
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300 hover:bg-gray-700 disabled:opacity-50"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between gap-4">
          {/* Search */}
          <TextInput
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            className="flex-1"
          />

          {/* Discrete slider: left = hardest, right = All */}
          <div className="flex items-baseline space-x-2">
            <span className="text-sm">Max swing {thresholdLabels[thrIdx]}</span>
            <RangeSlider
              value={thrIdx}
              onChange={(e) => setThrIdx(Number(e.currentTarget.value))}
              min={0}
              max={thresholdOptions.length - 1}
              step={1}
              className="w-32"
            />
          </div>
        </div>

        {/* List */}
        <DrillList
          drills={filtered}
          loading={loading}
          onStartDrill={(fen) =>
            navigate(`/coach?fen=${encodeURIComponent(fen)}`)
          }
        />
      </div>
    </div>
  );
}
