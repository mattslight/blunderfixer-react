import DrillCard from '@/pages/drills/components/DrillCard';
import type { DrillPosition } from '@/types';

interface Props {
  drills: DrillPosition[];
  onStart: (id: number | string) => void;
}

export default function NextDrillStack({ drills, onStart }: Props) {
  const visible = drills.slice(0, 3);
  if (!visible.length) {
    return <p className="mt-4 text-center text-gray-500">No drills queued.</p>;
  }
  return (
    <div className="relative mx-auto max-w-xl" style={{ height: 420 }}>
      {visible.map((d, idx) => (
        <div
          key={d.id}
          className="absolute right-0 left-0 transition-transform"
          style={{
            transform: `translateY(${idx * 1.2}rem) scale(${1 - idx * 0.05})`,
            zIndex: visible.length - idx,
          }}
        >
          <DrillCard drill={d} onStartDrill={() => onStart(d.id)} />
        </div>
      ))}
    </div>
  );
}
