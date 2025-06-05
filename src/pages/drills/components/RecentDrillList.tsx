import { Spinner } from 'flowbite-react';

import RecentDrillRow from './RecentDrillRow';

import type { DrillPosition } from '@/types';

interface Props {
  drills: DrillPosition[];
  loading: boolean;
  onPlay: (id: number) => void;
}

export default function RecentDrillList({ drills, loading, onPlay }: Props) {
  if (loading) {
    return <Spinner size="lg" className="mx-auto mt-16" />;
  }
  if (!drills.length) {
    return <p className="mt-16 text-center text-gray-500">No recent drills.</p>;
  }
  return (
    <ul className="space-y-6">
      {drills.map((d) => (
        <RecentDrillRow key={d.id} drill={d} onPlay={onPlay} />
      ))}
    </ul>
  );
}
