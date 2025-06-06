// src/pages/DrillsPage.tsx

import { useMemo, useState } from 'react';
import RangeSlider from 'react-range-slider-input';
import { useNavigate } from 'react-router-dom';
import { Badge, TextInput } from 'flowbite-react';
import { RefreshCw, SlidersHorizontal } from 'lucide-react';

import DrillList from './components/DrillList';
import FilterModal from './components/FilterModal';
import RecentDrillList from './components/RecentDrillList';
import { useDrills } from './hooks/useDrills';
import { useRecentDrills } from './hooks/useRecentDrills';
import {
  buildDrillFilters,
  PhaseFilter,
  THRESHOLD_OPTIONS,
} from './utils/filters';
import 'react-range-slider-input/dist/style.css';

import Tabs from '@/components/Tabs';
import { useDebounce } from '@/hooks/useDebounce';
import { useProfile } from '@/hooks/useProfile';
import { useStickyValue } from '@/hooks/useStickyValue';

const PHASES = ['all', 'opening', 'middle', 'late', 'endgame'] as const;
type Phase = PhaseFilter;

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

  const [tabIndex, setTabIndex] = useState(0);

  // profile
  const {
    profile: { username },
  } = useProfile();

  const { drills: recentDrills, loading: recentLoading } =
    useRecentDrills(username);

  // UI state
  const [phaseFilter, setPhaseFilter] = useStickyValue<Phase>(
    'drillPhaseFilter',
    'all'
  );
  const [excludeWins, setExcludeWins] = useStickyValue<boolean>(
    'drillExcludeWins',
    true
  );
  const [includeArchived, setIncludeArchived] = useStickyValue<boolean>(
    'drillIncludeArchived',
    false
  );
  const [includeMastered, setIncludeMastered] = useStickyValue<boolean>(
    'drillIncludeMastered',
    false
  );

  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  // slider->cp
  const [rangeIdx, setRangeIdx] = useStickyValue<[number, number]>(
    'drillRangeIdx',
    [0, THRESHOLD_OPTIONS.length - 1]
  );

  // **server filter object**
  const sticky = {
    phaseFilter,
    excludeWins,
    includeArchived,
    includeMastered,
    rangeIdx,
  } as const;

  const filters = buildDrillFilters(
    username,
    sticky,
    debouncedSearch || undefined
  );

  const { drills, loading, refresh } = useDrills(filters);

  const newDrillsPanel = useMemo(
    () => (
      <>
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Phase badges */}
          <div className="flex flex-wrap items-center gap-2 text-gray-300">
            {PHASES.map((p) => (
              <Badge
                key={p}
                onClick={() => setPhaseFilter(p)}
                className={`cursor-pointer rounded border-1 border-gray-800 px-2.5 py-2 text-xs capitalize ${
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
            <span className="mr-4 text-sm font-medium text-gray-300">
              Blunder Size
            </span>
            <span className="text-xs font-bold text-gray-500">xs</span>
            <div className="w-50">
              <RangeSlider
                min={0}
                max={THRESHOLD_OPTIONS.length - 1}
                step={1}
                value={rangeIdx}
                onInput={(vals) => setRangeIdx(vals as [number, number])}
              />
            </div>
            <span className="text-xs font-bold text-gray-500">lg</span>
          </div>
        </div>
        <div className="mt-10 mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-500 sm:text-base">
            {`Showing ${drills.length} result${drills.length === 1 ? '' : 's'}`}
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>
        <FilterModal
          show={showFilters}
          onClose={() => setShowFilters(false)}
          excludeWins={excludeWins}
          setExcludeWins={setExcludeWins}
          includeArchived={includeArchived}
          setIncludeArchived={setIncludeArchived}
          includeMastered={includeMastered}
          setIncludeMastered={setIncludeMastered}
          ToggleSwitch={ToggleSwitch}
        />
        {/* List */}
        <DrillList
          drills={drills}
          loading={loading}
          onStartDrill={(id) => navigate(`/drills/play/${id}`)}
        />
      </>
    ),
    [
      drills,
      loading,
      phaseFilter,
      excludeWins,
      includeArchived,
      includeMastered,
      rangeIdx,
      search,
      showFilters,
      setPhaseFilter,
      setExcludeWins,
      setIncludeArchived,
      setIncludeMastered,
      setRangeIdx,
      refresh,
      navigate,
    ]
  );

  const historyPanel = useMemo(
    () => (
      <RecentDrillList
        drills={recentDrills}
        loading={recentLoading}
        onPlay={(id) => navigate(`/drills/play/${id}`)}
      />
    ),
    [recentDrills, recentLoading]
  );

  return (
    <div className="p-4 pt-8 2xl:ml-12">
      <div className="mx-auto max-w-2xl space-y-4">
        <Tabs
          labels={TABS}
          activeIndex={tabIndex}
          onChange={setTabIndex}
          className="mb-12"
        />
        <div className={tabIndex === 0 ? '' : 'hidden'}>{newDrillsPanel}</div>
        <div className={tabIndex === 1 ? '' : 'hidden'}>{historyPanel}</div>
      </div>
    </div>
  );
}
const TABS = ['New Drills', 'History'];
