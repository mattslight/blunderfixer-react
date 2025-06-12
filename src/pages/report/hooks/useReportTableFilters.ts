import { useStickyValue } from '../../../hooks/useStickyValue';

export interface ReportTableFilters {
  showAll: boolean;
  setShowAll: (v: boolean | ((prev: boolean) => boolean)) => void;
  heroOnly: boolean;
  setHeroOnly: (v: boolean | ((prev: boolean) => boolean)) => void;
}

export function useReportTableFilters(): ReportTableFilters {
  const [showAll, setShowAll] = useStickyValue<boolean>('showAllMoves', false);
  const [heroOnly, setHeroOnly] = useStickyValue<boolean>(
    'showHeroMovesOnly',
    false
  );
  return { showAll, setShowAll, heroOnly, setHeroOnly };
}
