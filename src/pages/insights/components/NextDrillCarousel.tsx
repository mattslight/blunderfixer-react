import { useEffect, useRef } from 'react';

import DrillCard from '@/pages/drills/components/DrillCard';
import type { DrillPosition } from '@/types';

interface Props {
  drills: DrillPosition[];
  onStart: (id: number | string) => void;
}

export default function NextDrillCarousel({ drills, onStart }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function handleScroll() {}
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  if (!drills.length) {
    return <p className="mt-4 text-center text-gray-500">No drills queued.</p>;
  }
  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
      >
        {drills.map((d) => (
          <div key={d.id} className="shrink-0 snap-center first:pl-4 last:pr-4">
            <DrillCard drill={d} onStartDrill={() => onStart(d.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
