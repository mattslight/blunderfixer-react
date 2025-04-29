// src/components/AnalysePGN.jsx
import { useEffect, useState } from 'react';

import { Chess } from 'chess.js';

import AnalysePosition from './AnalysePosition';

export default function AnalysePGN({ pgn, onBack }) {
  const [fens, setFens] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const chess = new Chess();

    // Fix PGN by inserting a blank line between headers and moves
    const fixedPgn = pgn.replace(/\](\s*\n)(\d+\.)/, ']\n\n$2');

    try {
      chess.loadPgn(fixedPgn); // no sloppy needed if PGN is clean
    } catch (err) {
      console.error('Failed to parse PGN:', err.message);
      return;
    }

    const history = chess.history({ verbose: true });
    chess.reset();
    const arr = [chess.fen()];
    history.forEach((m) => {
      chess.move(m);
      arr.push(chess.fen());
    });
    setFens(arr);
    console.log('Parsed FENs:', arr);
    setCurrentIdx(0);
  }, [pgn]);

  if (!fens.length) return <div>Parsing game…</div>;

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <button
        onClick={onBack}
        className="text-sm text-blue-500 hover:underline"
      >
        ← Back to list
      </button>

      {/* Step controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
        >
          Prev
        </button>
        <span>Move #{currentIdx}</span>
        <button
          onClick={() => setCurrentIdx((i) => Math.min(fens.length - 1, i + 1))}
          disabled={currentIdx === fens.length - 1}
          className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {console.log('Current FEN: ' + fens[currentIdx])}
      {/* Delegate to your existing FEN analyser */}
      <AnalysePosition startingFen={fens[currentIdx]} />
    </div>
  );
}
