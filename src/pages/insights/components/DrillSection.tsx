import { useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';

import NextDrillCarousel from './NextDrillCarousel';

import type { DrillPosition } from '@/types';

interface Props {
  drills: DrillPosition[];
  loading: boolean;
}

export default function DrillSection({ drills, loading }: Props) {
  const navigate = useNavigate();

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-stone-100">
          <Target className="relative bottom-0.25 mr-1 inline-flex w-5" /> More
          Drills
        </h2>
        <button
          className="text-sm text-blue-400 hover:underline"
          onClick={() => navigate('/drills')}
        >
          All Drills »
        </button>
      </div>
      {loading ? (
        <p className="mt-4 text-center text-stone-500">Loading…</p>
      ) : (
        <NextDrillCarousel
          drills={drills}
          onStart={(id) => navigate(`/drills/play/${id}`)}
        />
      )}
    </section>
  );
}
