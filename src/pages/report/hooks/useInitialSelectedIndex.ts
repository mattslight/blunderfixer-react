import { useEffect } from 'react';

import type { CombinedEntry } from '../components/SummaryTable';

export function useInitialSelectedIndex({
  combined,
  selectedIndex,
  setSelectedIndex,
  heroSide,
  showAll,
  heroOnly,
}: {
  combined: CombinedEntry[];
  selectedIndex: number | null;
  setSelectedIndex: (i: number) => void;
  heroSide: 'w' | 'b';
  showAll: boolean;
  heroOnly: boolean;
}) {
  useEffect(() => {
    if (selectedIndex != null || combined.length === 0) return;
    const entry = combined.find(
      (e) =>
        (showAll || e.tags[0] !== 'none') &&
        (!heroOnly || e.move.side === heroSide)
    );
    if (entry) setSelectedIndex(entry.analysis.halfMoveIndex);
    else setSelectedIndex(combined[0].analysis.halfMoveIndex);
  }, [combined, heroSide, selectedIndex, showAll, heroOnly]);
}
