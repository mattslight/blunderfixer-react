import { useEffect, useRef, useState } from 'react';
import DrillCard from '@/pages/drills/components/DrillCard';
import type { DrillPosition } from '@/types';

interface Props {
  drills: DrillPosition[];
  onStart: (id: number | string) => void;
}

export default function NextDrillCarousel({ drills, onStart }: Props) {
  const [index, setIndex] = useState(1);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function handleScroll() {
      const width = el.offsetWidth;
      const i = Math.round(el.scrollLeft / width) + 1;
      setIndex(i);
    }
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
          <div key={d.id} className="snap-center shrink-0 first:pl-4 last:pr-4">
            <DrillCard drill={d} onStartDrill={() => onStart(d.id)} />
          </div>
        ))}
      </div>
      <div className="absolute right-4 top-0 text-xs text-gray-400">
        {index}/{drills.length}
      </div>
    </div>
  );
}
