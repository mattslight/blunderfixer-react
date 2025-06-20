// src/pages/drills/components/ActionBar.tsx
import { useState } from 'react';
import { EllipsisVertical, Redo, RotateCcw } from 'lucide-react';

import BottomSheet from './BottomSheet';

export default function ActionBar({
  drillResult, // 'pass' | 'fail' | null
  onHint, // show hint/solution
  onRetry, // reset drill
  onNext, // skip or next drill
  onAnalysis, // open analysis board
  onArchive, // archive drill
  onCopy, // copy PGN/FEN
}: {
  drillResult: 'pass' | 'fail' | null;
  onHint: () => void;
  onRetry: () => void;
  onNext: () => void;
  onAnalysis: () => void;
  onArchive: () => void;
  onCopy: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  // decide primary labels/colors/icons
  const isFail = drillResult === 'fail';

  const primaryLabel = drillResult == null ? 'Hint' : isFail ? 'Retry' : 'Next';

  const primaryAction =
    drillResult == null ? onHint : isFail ? onRetry : onNext;

  const primaryColor =
    drillResult == null
      ? 'bg-indigo-600 hover:bg-indigo-700'
      : isFail
        ? 'bg-red-600 hover:bg-red-700'
        : 'bg-green-600 hover:bg-green-700';

  // secondary button icon+label
  let SecondaryIcon = Redo;
  let secondaryLabel = 'Skip';
  let secondaryAction = onNext;

  if (drillResult === 'pass') {
    SecondaryIcon = RotateCcw;
    secondaryLabel = 'Replay';
    secondaryAction = onRetry;
  }

  return (
    <>
      <div className="safe-bottom fixed bottom-0 left-0 z-50 flex w-full items-center bg-stone-900 px-4 py-3">
        {/* Menu trigger */}
        <button
          onClick={() => setMenuOpen(true)}
          className="rounded-md text-stone-400 hover:text-white"
        >
          <EllipsisVertical />
        </button>

        {/* Primary big button */}
        <button
          onClick={primaryAction}
          className={`mx-2 flex-1 rounded-md py-2 text-base font-semibold text-white transition ${primaryColor}`}
        >
          {primaryLabel}
        </button>

        {/* Secondary small button */}
        <button
          onClick={secondaryAction}
          className="flex flex-col items-center gap-1 rounded-md px-3 py-2 text-xs font-semibold text-stone-400 hover:text-white"
        >
          <SecondaryIcon className="mr-1 inline h-5 w-5" />
          {secondaryLabel}
        </button>
      </div>

      {/* Slide-up bottom sheet for menu actions */}
      <BottomSheet
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onAnalysis={() => {
          setMenuOpen(false);
          onAnalysis();
        }}
        onArchive={() => {
          setMenuOpen(false);
          onArchive();
        }}
        onCopy={() => {
          setMenuOpen(false);
          onCopy();
        }}
      />
    </>
  );
}
