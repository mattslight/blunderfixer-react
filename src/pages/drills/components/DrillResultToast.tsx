import React, { useEffect, useState } from 'react';
import { CheckCircle, RotateCcw, XCircle } from 'lucide-react';

interface Props {
  result: 'pass' | 'fail' | null;
  reason: string | null;
  onRetry: () => void;
  onNext: () => void;
}

export default function DrillResultToast({ result, reason, onRetry, onNext }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (result) setVisible(true);
  }, [result, reason]);

  if (!result || !visible) return null;

  const isPass = result === 'pass';

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center">
      <div
        className={`pointer-events-auto flex items-center space-x-3 rounded-md px-4 py-2 shadow-lg ${
          isPass
            ? 'bg-green-800 text-green-100'
            : 'bg-red-800 text-red-100'
        }`}
      >
        {isPass ? (
          <CheckCircle className="h-5 w-5 text-green-300" />
        ) : (
          <XCircle className="h-5 w-5 text-red-300" />
        )}
        <span className="text-sm">
          {reason ?? (isPass ? 'You met the goal!' : 'Better luck next time.')}
        </span>
        {result === 'fail' && (
          <button
            onClick={onRetry}
            className="flex items-center rounded bg-gray-700 px-2 py-1 text-xs text-white hover:bg-gray-600"
          >
            <RotateCcw className="mr-1 h-3 w-3" /> Retry
          </button>
        )}
        <button
          onClick={onNext}
          className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-500"
        >
          Next
        </button>
        <button
          onClick={() => setVisible(false)}
          aria-label="Dismiss"
          className="ml-1 text-lg leading-none text-white/60 hover:text-white"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
