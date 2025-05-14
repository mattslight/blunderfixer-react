// src/pages/report/components/MoveControls.tsx
import { ChevronLeft, ChevronRight, FastForward, Rewind } from 'lucide-react';

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
    <div className="mt-4 flex justify-center space-x-2">
      <button
        onClick={onPrevKeymove}
        disabled={disablePrevKeymove}
        aria-label="Jump to previous key move"
        className="rounded bg-gray-700 p-2 hover:bg-gray-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Rewind size={20} className="text-white" />
      </button>

      <button
        onClick={onPrev}
        disabled={disablePrev}
        aria-label="Step back one move"
        className="rounded bg-gray-700 p-2 hover:bg-gray-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft size={20} className="text-white" />
      </button>

      <button
        onClick={onNext}
        disabled={disableNext}
        aria-label="Step forward one move"
        className="rounded bg-gray-700 p-2 hover:bg-gray-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRight size={20} className="text-white" />
      </button>

      <button
        onClick={onNextKeymove}
        disabled={disableNextKeymove}
        aria-label="Jump to next key move"
        className="rounded bg-gray-700 p-2 hover:bg-gray-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FastForward size={20} className="text-white" />
      </button>
    </div>
  );
}
