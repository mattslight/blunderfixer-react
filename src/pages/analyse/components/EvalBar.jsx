// src/pages/analyse/components/EvalBar.jsx
import React from 'react';

function pawnToPct(pawn) {
  // 1) If White is up ≥6 pawns, start at 90% and go to 100% by +10
  if (pawn >= 6) {
    // (pawn - 6) goes from 0 → 4  across 90 → 100%
    return Math.min(90 + ((pawn - 6) / 4) * 10, 100);
  }
  // 2) If Black is up ≥6 pawns, mirror it down to 0…10%
  if (pawn <= -6) {
    // (-6 - pawn) goes from 0 → 4 across 10 → 0%
    return Math.max(10 - ((-6 - pawn) / 4) * 10, 0);
  }
  // 3) Everything else (pawn ∈ [-6, +6]) → linear [10%,90%]
  return ((pawn + 6) / 12) * 80 + 10;
}

export default function EvalBar({ score, className = '' }) {
  const pawn = score / 100; // e.g. +3.2  or  -1.4
  const pct = pawnToPct(pawn); // maps into 0–100%

  return (
    <div className={`relative self-stretch overflow-hidden ${className}`}>
      {/* black from the top */}
      <div
        className="absolute inset-x-0 top-0 bg-black transition-[height] duration-1000 ease-in"
        style={{ height: `${100 - pct}%` }}
      />
      {/* white from the bottom */}
      <div
        className="absolute inset-x-0 bottom-0 bg-white transition-[height] duration-1000 ease-in"
        style={{ height: `${pct}%` }}
      />
    </div>
  );
}
