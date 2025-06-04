// src/pages/drills/components/DrillBanner.tsx
import React from 'react';
import { Crosshair, RotateCcw } from 'lucide-react';

interface Props {
  expectedResult: 'win' | 'draw' | 'hold' | null;
  drillResult: 'pass' | 'fail' | null;
  reason: string | null;
  setResetKey: React.Dispatch<React.SetStateAction<number>>;
  onNext: () => void;
}

export default function DrillBanner({
  expectedResult,
  drillResult,
  reason,
  setResetKey,
  onNext,
}: Props) {
  return (
    <div className="flex w-full flex-col items-center space-y-2">
      {/* Drill Goal Banner (only show before result) */}
      {expectedResult && !drillResult && (
        <div className="flex w-full items-center justify-center rounded border border-indigo-500 bg-indigo-900 px-4 py-2 text-center text-indigo-200">
          <Crosshair className="mr-1 h-4 w-4 text-indigo-400" />
          <span className="text-sm">
            <span className="mr-1 font-bold text-white/80">Goal</span>
            {expectedResult === 'win' && 'Convert the Win'}
            {expectedResult === 'hold' && 'Defend like Gurkesh!'}
            {expectedResult === 'draw' && 'Hold the Draw'}
          </span>
        </div>
      )}

      {/* Drill Result Banner */}
      {drillResult && (
        <div
          className={`flex items-center justify-center space-x-2 rounded-md px-4 py-2 text-center text-sm font-medium ${
            drillResult === 'pass'
              ? 'border border-green-500 bg-green-900 text-green-100'
              : 'border border-red-500 bg-red-900 text-red-100'
          }`}
        >
          <span>
            {drillResult === 'pass'
              ? `✅ ${reason ?? 'You met the goal!'}`
              : `❌ ${reason ?? 'Better luck next time.'}`}
          </span>
          {drillResult === 'fail' && (
            <button
              onClick={() => setResetKey((prev) => prev + 1)}
              className="inline-flex items-center rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <RotateCcw className="mr-1 h-3 w-3" />
              Retry
            </button>
          )}
          <button
            onClick={onNext}
            className="inline-flex items-center rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
