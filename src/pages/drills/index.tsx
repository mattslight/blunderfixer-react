// src/pages/DrillsPage.tsx

import { useState } from 'react';
import RangeSlider from 'react-range-slider-input';
import { useNavigate } from 'react-router-dom';
import { Badge, TextInput } from 'flowbite-react';
import { RefreshCw } from 'lucide-react';

import DrillList from './components/DrillList';
import { useDrills } from './hooks/useDrills';
import 'react-range-slider-input/dist/style.css';

import { useDebounce } from '@/hooks/useDebounce';
import { useProfile } from '@/hooks/useProfile';
import { useStickyValue } from '@/hooks/useStickyValue';

const PHASES = ['all', 'opening', 'middle', 'late', 'endgame'] as const;
type Phase = (typeof PHASES)[number];

const PHASE_COLORS: Record<Phase, string> = {
  all: 'bg-gray-600',
  opening: 'bg-blue-700',
  middle: 'bg-purple-700',
  late: 'bg-fuchsia-700',
  endgame: 'bg-rose-700',
};

function ToggleSwitch({ checked, onChange }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div className="h-3 w-7 rounded-full bg-gray-300 transition-colors duration-200 peer-checked:bg-blue-500 dark:bg-gray-600" />
      <div className="absolute left-0.5 h-3.5 w-3.5 rounded-full bg-white transition-transform duration-200 ease-in-out peer-checked:translate-x-3" />
    </label>
  );
}

export default function DrillsPage() {
  const navigate = useNavigate();

  const thresholdOptions = [
    1,
    150,
    225,
    337,
    500,
    1000,
    10000,
    Infinity,
  ] as const;

  // profile
  const {
    profile: { username },
  } = useProfile();

  // UI state
  const [phaseFilter, setPhaseFilter] = useStickyValue<Phase>(
    'drillPhaseFilter',
    'all'
  );
  const [excludeWins, setExcludeWins] = useStickyValue<boolean>(
    'drillExcludeWins',
    true
  );

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  // slider->cp
  const [rangeIdx, setRangeIdx] = useStickyValue<[number, number]>(
    'drillRangeIdx',
    [0, thresholdOptions.length - 1]
  );
  const [minCutoff, maxCutoff] = [
    thresholdOptions[rangeIdx[0]],
    thresholdOptions[rangeIdx[1]],
  ];

  // **server filter object**
  const filters = {
    username,
    minEvalSwing: minCutoff,
    maxEvalSwing: Number.isFinite(maxCutoff) ? maxCutoff : undefined,
    phases: phaseFilter === 'all' ? undefined : [phaseFilter],
    heroResults: excludeWins
      ? (['loss', 'draw'] as Array<'loss' | 'draw'>)
      : undefined,
    opponent: debouncedSearch || undefined,
    limit: 20,
    openingThreshold: 14,
  } as const;

  const { drills, loading, refresh } = useDrills(filters);

  return (
    <div className="p-4 pt-8 2xl:ml-12">
      <div className="mx-auto max-w-2xl space-y-4">
        <span className="inline-block py-0.5 text-xs font-semibold tracking-wider text-blue-400 uppercase">
          Drills
        </span>
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Phase badges */}
          <div className="flex flex-wrap items-center gap-2 text-gray-300">
            {PHASES.map((p) => (
              <Badge
                key={p}
                onClick={() => setPhaseFilter(p)}
                className={`cursor-pointer rounded border-1 border-gray-800 px-3 py-2 text-sm capitalize sm:text-base ${
                  phaseFilter === p && PHASE_COLORS[p]
                }`}
              >
                {p}
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
        <div className="mt-10 flex items-center justify-between">
          <div className="text-sm text-gray-600 sm:text-base">
            {`Showing ${drills.length} result${drills.length === 1 ? '' : 's'}`}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-gray-300">
            <span className="text-sm text-gray-600">Exclude games won</span>
            <div>
              <ToggleSwitch
                checked={excludeWins}
                onChange={() => setExcludeWins(!excludeWins)}
              />
            </div>
          </div>
        </div>
        {/* List */}
        <DrillList
          drills={drills}
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
