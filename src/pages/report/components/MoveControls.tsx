// src/pages/report/components/MoveControls.tsx
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';

interface MoveControlsProps {
  onPrev: () => void;
  onNext: () => void;
  onPrevKeymove: () => void;
  onNextKeymove: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
  disablePrevKeymove?: boolean;
  disableNextKeymove?: boolean;
}

export default function MoveControls({
  onPrev,
  onNext,
  onPrevKeymove,
  onNextKeymove,
  disablePrev = false,
  disableNext = false,
  disablePrevKeymove = false,
  disableNextKeymove = false,
}: MoveControlsProps) {
  return (
    <div className="mt-4 flex justify-center space-x-3">
      <button
        onClick={onPrevKeymove}
        disabled={disablePrevKeymove}
        aria-label="Jump to previous key move"
        className="rounded bg-stone-700 p-2 hover:bg-stone-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <SkipBack size={26} strokeWidth={1} className="text-stone-300" />
      </button>

      <button
        onClick={onPrev}
        disabled={disablePrev}
        aria-label="Step back one move"
        className="rounded bg-stone-700 p-2 hover:bg-stone-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft size={26} strokeWidth={1} className="text-stone-300" />
      </button>

      <button
        onClick={onNext}
        disabled={disableNext}
        aria-label="Step forward one move"
        className="rounded bg-stone-700 p-2 hover:bg-stone-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRight size={26} strokeWidth={1} className="text-stone-300" />
      </button>

      <button
        onClick={onNextKeymove}
        disabled={disableNextKeymove}
        aria-label="Jump to next key move"
        className="rounded bg-stone-700 p-2 hover:bg-stone-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <SkipForward size={26} strokeWidth={1} className="text-stone-300" />
      </button>
    </div>
  );
}
