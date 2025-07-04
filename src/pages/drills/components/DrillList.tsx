// src/pages/drills/components/DrillList.tsx

import { Spinner } from 'flowbite-react';

import DrillCard from './DrillCard';

import type { DrillPosition } from '@/types';

interface Props {
  drills: DrillPosition[];
  loading: boolean;
  onStartDrill: (id: number | string) => void;
}

export default function DrillList({ drills, loading, onStartDrill }: Props) {
  if (loading) {
    return <Spinner size="lg" className="mx-auto mt-16" />;
  }
  if (!drills.length) {
    return (
      <p className="mt-16 text-center text-stone-500">
        No drills matching filter
      </p>
    );
  }
  return (
    <div className="space-y-8 sm:space-y-12">
      {drills.map((d) => {
        return (
          <DrillCard
            key={d.id}
            drill={d}
            onStartDrill={() => onStartDrill(d.id)}
          />
        );
      })}
    </div>
  );
}
