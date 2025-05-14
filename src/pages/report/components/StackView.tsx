// src/pages/report/components/StackView.tsx
import { useState } from 'react';
import CardView from './CardView';
import type { CombinedEntry } from './GameSummaryTable';

export default function StackView({
  entries,
  onDrill,
  pgn,
}: {
  entries: CombinedEntry[];
  onDrill?: (pgn: string, halfMoveIndex: number) => void;
  pgn: string;
}) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((i) => Math.max(0, i - 1));
  const next = () => setCurrent((i) => Math.min(entries.length - 1, i + 1));

  return (
    <div>
      {/* show only the one entry at `current` */}
      <CardView entry={entries[current]} onDrill={onDrill} pgn={pgn} />

      <div className="mt-2 flex justify-between">
        <button onClick={prev} disabled={current === 0}>
          ← Prev
        </button>
        <button onClick={next} disabled={current === entries.length - 1}>
          Next →
        </button>
      </div>
    </div>
  );
}
