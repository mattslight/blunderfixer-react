// src/pages/analyse/components/EvalBar.tsx
import React from 'react';

interface EvalBarProps {
  score: number;
  className?: string;
  boardOrientation?: 'white' | 'black';
}

function pawnToPct(pawn: number): number {
  if (pawn >= 6) {
    return Math.min(90 + ((pawn - 6) / 4) * 10, 100);
  }
  if (pawn <= -6) {
    return Math.max(10 - ((-6 - pawn) / 4) * 10, 0);
  }
  return ((pawn + 6) / 12) * 80 + 10;
}

const EvalBar: React.FC<EvalBarProps> = ({
  score,
  className = '',
  boardOrientation = 'white',
}) => {
  const pawn = score / 100;
  const pct = pawnToPct(pawn);

  const whiteHeight = pct;
  const blackHeight = 100 - pct;

  const whiteBarPosition = boardOrientation === 'white' ? 'bottom-0' : 'top-0';
  const blackBarPosition = boardOrientation === 'white' ? 'top-0' : 'bottom-0';

  return (
    <div className={`relative self-stretch overflow-hidden ${className}`}>
      {/* Black bar */}
      <div
        className={`absolute inset-x-0 ${blackBarPosition} bg-black transition-[height] duration-1000 ease-in`}
        style={{ height: `${blackHeight}%` }}
      />
      {/* White bar */}
      <div
        className={`absolute inset-x-0 ${whiteBarPosition} bg-white transition-[height] duration-1000 ease-in`}
        style={{ height: `${whiteHeight}%` }}
      />
    </div>
  );
};

export default EvalBar;
