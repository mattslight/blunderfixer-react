// src/pages/report/components/StackView.tsx
import { useEffect, useState } from 'react';
import CardView from './CardView';
import type { CombinedEntry } from './GameSummaryTable';

export default function StackView({
  entries,
  onDrill,
  pgn,
  showAll,
}: {
  entries: CombinedEntry[];
  onDrill?: (pgn: string, halfMoveIndex: number) => void;
  pgn: string;
  showAll?: boolean;
}) {
  const [current, setCurrent] = useState(0);

  // 1. clamp at render time
  const safeCurrent = Math.max(0, Math.min(current, entries.length - 1));

  // 2. keep state in sync (optional)
  useEffect(() => {
    if (current !== safeCurrent) setCurrent(safeCurrent);
  }, [current, safeCurrent]);

  if (!entries.length) {
    return <div>No moves to display</div>;
  }

  return (
    <div>
      <CardView entry={entries[safeCurrent]} onDrill={onDrill} pgn={pgn} />

      <div className="mt-2 flex justify-between">
        <button
          onClick={() => setCurrent((i) => i - 1)}
          disabled={safeCurrent === 0}
          className="disabled:opacity-40"
        >
          ← Prev
        </button>
        <button
          onClick={() => setCurrent((i) => i + 1)}
          disabled={safeCurrent === entries.length - 1}
          className="disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
