// src/pages/drills/components/DrillList.tsx

import type { DrillPosition } from '@/types';
import { Spinner } from 'flowbite-react';
import DrillCard from './DrillCard';

interface Props {
  drills: DrillPosition[];
  loading: boolean;
  onStartDrill: (fen: string, orientation: 'black' | 'white') => void;
}

export default function DrillList({ drills, loading, onStartDrill }: Props) {
  if (loading) {
    return <Spinner size="lg" className="mx-auto mt-16" />;
  }
  if (!drills.length) {
    return (
      <p className="mt-16 text-center text-gray-500">
        No drills matching filter
      </p>
    );
  }
  return (
    <div className="space-y-8 sm:space-y-12">
      {drills.map((d) => {
        return <DrillCard key={d.id} drill={d} onStartDrill={onStartDrill} />;
      })}
    </div>
  );
}
