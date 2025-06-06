import { useEffect, useRef, useState } from 'react';

import DrillCard from '@/pages/drills/components/DrillCard';
import type { DrillPosition } from '@/types';

interface Props {
  drills: DrillPosition[];
  onStart: (id: number | string) => void;
}

export default function NextDrillCarousel({ drills, onStart }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      const children = Array.from(el.children);
      const scrollLeft = el.scrollLeft;
      const childWidths = children.map(
        (child) => (child as HTMLElement).offsetLeft
      );
      const index = childWidths.findIndex(
        (offset, i) =>
          scrollLeft < offset + (children[i] as HTMLElement).offsetWidth / 2
      );
      setActiveIndex(index === -1 ? children.length - 1 : index);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
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
          <div key={d.id} className="shrink-0 snap-center">
            <DrillCard drill={d} onStartDrill={() => onStart(d.id)} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-1">
        {drills.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 w-2 rounded-full ${
              idx === activeIndex ? 'bg-white' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
