// src/pages/analyse/AnalysePGN.jsx
import { useEffect, useState } from 'react';

import { Chess } from 'chess.js';

import AnalysePosition from './BoardAndEval';
import MoveStepper from './MoveStepper';

export default function AnalysePGN({ pgn, onBack }) {
  const [fens, setFens] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [moveList, setMoveList] = useState([]);

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

    const moveList = chess.history(); // <-- get plain SAN strings
    setMoveList(moveList);
    console.log(moveList);

    chess.reset();
    const arr = [chess.fen()];
    moveList.forEach((m) => {
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
        ← Back to games
      </button>

      {/* Step controls */}
      <MoveStepper
        moveList={moveList}
        currentIdx={currentIdx}
        setCurrentIdx={setCurrentIdx}
      />

      {console.log('Current FEN: ' + fens[currentIdx])}
      {/* Delegate to your existing FEN analyser */}
      <AnalysePosition startingFen={fens[currentIdx]} pgnMode={true} />
    </div>
  );
}
