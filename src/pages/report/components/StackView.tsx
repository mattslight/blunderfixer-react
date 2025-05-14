// src/pages/report/components/StackView.tsx
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import CardView from './CardView';
import MoveControls from './MoveControls';
import type { CombinedEntry } from './SummaryTable';

export default function StackView({
  entries,
  onDrill,
  pgn,
  selectedIndex,
}: {
  entries: CombinedEntry[];
  onDrill?: (pgn: string, halfMoveIndex: number) => void;
  pgn: string;
  selectedIndex?: number | null;
}) {
  const [current, setCurrent] = useState(0);
  const frameRef = useRef<number>(null);

  // ensure index never out of bounds
  const safeCurrent = Math.max(0, Math.min(current, entries.length - 1));

  // ease-in-out quad curve for natural feel
  function easeInOutQuad(t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  /**
   * Glide to target index over a fixed duration (~1.5s),
   * independently of number of steps
   */
  function glideTo(target: number) {
    cancelAnimationFrame(frameRef.current!); // cancel any ongoing
    const start = current;
    const delta = target - start;
    const duration = 1500; // ms, constant total animation time
    const t0 = performance.now();

    function tick(now: number) {
      const elapsed = now - t0;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeInOutQuad(t);
      const idx = Math.round(start + delta * eased);
      setCurrent(idx);
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
  }

  // 1) Build a map for O(1) lookups
  const indexMap = useMemo(() => {
    const m = new Map<number, number>();
    entries.forEach((e, i) => {
      m.set(e.analysis.halfMoveIndex, i);
    });
    return m;
  }, [entries]);

  // 2) useLayoutEffect so we sync current *before* paint
  useLayoutEffect(() => {
    if (selectedIndex != null) {
      const idx = indexMap.get(selectedIndex);
      if (idx !== undefined && idx !== current) {
        glideTo(idx);
      }
    }
  }, [selectedIndex, indexMap]); // no need to include `current` here

  // cleanup on unmount
  useEffect(() => () => cancelAnimationFrame(frameRef.current!), []);

  if (!entries.length) {
    return <div className="text-center text-gray-500">No moves to display</div>;
  }

  // simple step handlers
  function handlePrev() {
    cancelAnimationFrame(frameRef.current!);
    setCurrent((i) => Math.max(0, i - 1));
  }
  function handleNext() {
    cancelAnimationFrame(frameRef.current!);
    setCurrent((i) => Math.min(entries.length - 1, i + 1));
  }

  // jumps using glide
  function handleNextKeymove() {
    const next = entries.findIndex(
      (e, i) => i > safeCurrent && e.tags[0] !== 'none'
    );
    glideTo(next === -1 ? entries.length - 1 : next);
  }
  function handlePrevKeymove() {
    const prev =
      entries
        .slice(0, safeCurrent)
        .map((e, i) => ({ e, i }))
        .reverse()
        .find((x) => x.e.tags[0] !== 'none')?.i ?? 0;
    glideTo(prev);
  }

  return (
    <div>
      <CardView entry={entries[safeCurrent]} onDrill={onDrill} pgn={pgn} />
      <MoveControls
        onPrev={handlePrev}
        onNext={handleNext}
        onPrevKeymove={handlePrevKeymove}
        onNextKeymove={handleNextKeymove}
        disablePrev={safeCurrent === 0}
        disablePrevKeymove={safeCurrent === 0}
        disableNext={safeCurrent === entries.length - 1}
        disableNextKeymove={safeCurrent === entries.length - 1}
      />
    </div>
  );
}
