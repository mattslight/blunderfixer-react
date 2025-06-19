// src/pages/drills/components/ActionBar.tsx
import React from 'react';
import { RotateCcw, SkipForward } from 'lucide-react';

export default function ActionBar({
  drillResult, // 'pass' | 'fail' | null
  onHint, // show hint/solution
  onRetry, // reset drill
  onNext, // skip or next drill
}: {
  drillResult: 'pass' | 'fail' | null;
  onHint: () => void;
  onRetry: () => void;
  onNext: () => void;
}) {
  // decide labels, handlers, colors and icons
  let primaryLabel: string;
  let primaryAction: () => void;
  let primaryColor: string;

  let secondaryLabel: string;
  let secondaryAction: () => void;
  let SecondaryIcon: React.FC<any>;

  if (drillResult === null) {
    primaryLabel = 'Hint';
    primaryAction = onHint;
    primaryColor = 'bg-indigo-600 hover:bg-indigo-700';

    secondaryLabel = 'Skip';
    secondaryAction = onNext;
    SecondaryIcon = SkipForward;
  } else if (drillResult === 'pass') {
    primaryLabel = 'Next';
    primaryAction = onNext;
    primaryColor = 'bg-green-600 hover:bg-green-700';

    secondaryLabel = 'Replay';
    secondaryAction = onRetry;
    SecondaryIcon = RotateCcw;
  } else {
    primaryLabel = 'Retry';
    primaryAction = onRetry;
    primaryColor = 'bg-red-600 hover:bg-red-700';

    secondaryLabel = 'Skip';
    secondaryAction = onNext;
    SecondaryIcon = SkipForward;
  }

  return (
    <div className="safe-bottom fixed bottom-0 left-0 z-50 flex w-full items-center bg-stone-900 px-4 py-3">
      {/* Primary big button */}
      <button
        onClick={primaryAction}
        className={`mx-2 flex-1 rounded-md px-4 py-3 text-base font-bold text-white transition ${primaryColor}`}
      >
        {primaryLabel}
      </button>

      {/* Secondary small button */}
      <button
        onClick={secondaryAction}
        className="flex flex-col items-center gap-1 rounded-md px-3 py-2 text-xs font-semibold text-stone-200 hover:text-white"
      >
        <SecondaryIcon className="inline h-5 w-5" />
        {secondaryLabel}
      </button>
    </div>
  );
}
