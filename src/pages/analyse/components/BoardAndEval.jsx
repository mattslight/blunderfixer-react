// src/pages/analyse/components/BoardAndEval.jsx
import { Chessboard } from 'react-chessboard';

import ExamplePositions from './ExamplePositions';
import MoveLines from './MoveLines';
import MoveStepper from './MoveStepper';

export default function BoardAndEval({
  fen,
  lines,
  arrows,
  moveSquares,
  currentDepth,

  moveList,
  currentIdx,
  setCurrentIdx,
  handleDrop, // ← pulled in here

  handleSquareClick,
  showPromotionDialog,
  moveTo,
  handlePromotionPieceSelect,
  optionSquares,

  setPGN, // for example‐position picker
}) {
  // 1) If no FEN yet, show your examples picker
  if (!fen) {
    return (
      <div className="p-4">
        <ExamplePositions onPickFEN={(f) => setPGN(`[FEN "${f}"]\n\n`)} />
      </div>
    );
  }

  console.log('current fen is:', fen);

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* 2) MoveStepper navigation */}
      <div className="w-full max-w-lg">
        <MoveStepper
          moveList={moveList}
          currentIdx={currentIdx}
          setCurrentIdx={setCurrentIdx}
        />
      </div>
      {/* 3) Board with drag/drop */}
      <div className="w-full max-w-lg">
        <Chessboard
          position={fen}
          onSquareClick={handleSquareClick}
          showPromotionDialog={showPromotionDialog}
          promotionToSquare={moveTo}
          onPromotionPieceSelect={handlePromotionPieceSelect}
          customSquareStyles={{
            ...moveSquares,
            ...optionSquares,
          }}
          onPieceDrop={handleDrop}
          customArrows={arrows}
          customBoardStyle={{
            borderRadius: '0.30rem',
            boxShadow: `0 4px 12px rgba(0,0,0,0.35),
                        inset 0 0 4px rgba(0,0,0,0.15)`,
          }}
          customDarkSquareStyle={{
            backgroundColor: 'rgb(177,183,200)',
          }}
          customLightSquareStyle={{
            backgroundColor: 'rgb(245,242,230)',
            mixBlendMode: 'multiply',
          }}
        />
      </div>

      {/* 4) Engine continuation lines */}
      <div className="w-full max-w-lg">
        <MoveLines lines={lines} currentDepth={currentDepth} />
      </div>
    </div>
  );
}
