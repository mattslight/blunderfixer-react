// src/pages/AnalysePosition/MoveStepper.jsx
import { useEffect, useRef } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MoveStepper({ moveList, currentIdx, setCurrentIdx }) {
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [currentIdx]);

  const renderMoves = () => {
    const moves = [];
    for (let i = 0; i < moveList.length; i += 2) {
      const moveNum = i / 2 + 1;
      moves.push(
        <div key={i} className="flex items-center space-x-1 whitespace-nowrap">
          <span className="text-sm text-gray-400">{moveNum}.</span>

          <button
            ref={currentIdx === i + 1 ? activeRef : null}
            onClick={() => setCurrentIdx(i + 1)}
            className={`px-1 text-sm font-bold whitespace-nowrap ${
              currentIdx === i + 1
                ? 'rounded bg-gray-600 text-white'
                : 'text-gray-200'
            }`}
          >
            {moveList[i]}
          </button>

          {moveList[i + 1] && (
            <button
              ref={currentIdx === i + 2 ? activeRef : null}
              onClick={() => setCurrentIdx(i + 2)}
              className={`px-1 text-sm font-bold whitespace-nowrap ${
                currentIdx === i + 2
                  ? 'rounded bg-gray-600 text-white'
                  : 'text-gray-200'
              }`}
            >
              {moveList[i + 1]}
            </button>
          )}
        </div>
      );
    }
    return moves;
  };

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <button
        onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
        disabled={currentIdx === 0}
      >
        <ChevronLeft className="h-5 w-5 text-white/80" />
      </button>

      <div className="scrollbar-hide flex max-w-full space-x-2 overflow-x-auto px-2">
        {renderMoves()}
      </div>

      <button
        onClick={() => setCurrentIdx((i) => Math.min(moveList.length, i + 1))}
        disabled={currentIdx >= moveList.length}
      >
        <ChevronRight className="h-5 w-5 text-white/80" />
      </button>
    </div>
  );
}
