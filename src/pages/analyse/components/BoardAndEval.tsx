// src/pages/analyse/components/BoardAndEval.jsx
import { useEffect, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';

import EvalBar from './EvalBar';
import ExamplePositions from './ExamplePositions';
import MoveLines from './MoveLines';
import MoveStepper from './MoveStepper';

export default function BoardAndEval({
  fen,
  lines,
  arrows,
  moveSquares,
  currentDepth,
  evalScore,

  moveList,
  currentIdx,
  setCurrentIdx,

  moveTo,
  optionSquares,
  onPieceDrop,
  onSquareClick,
  onPromotionPieceSelect,
  showPromotionDialog,

  setPGN, // for example‐position picker
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = useState(464);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setBoardWidth(entry.contentRect.width);
      }
    });
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  // 1) If no FEN yet, show your examples picker
  if (!fen) {
    return (
      <div className="p-4">
        <ExamplePositions onPickFEN={(f) => setPGN(`[FEN "${f}"]\n\n`)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* 2) MoveStepper navigation */}
      <div className="w-full max-w-lg">
        <MoveStepper
          moveList={moveList}
          currentIdx={currentIdx}
          setCurrentIdx={setCurrentIdx}
        />
      </div>
      {/* <-- zero-gap flex container --> */}
      <div
        ref={wrapperRef}
        className="flex w-full max-w-lg gap-0 lg:max-w-[464px] xl:max-w-lg"
      >
        <div className="flex-1">
          {boardWidth > 0 && (
            <Chessboard
              boardWidth={boardWidth - 16}
              position={fen}
              promotionDialogVariant={'modal'}
              onSquareClick={onSquareClick}
              showPromotionDialog={showPromotionDialog}
              promotionToSquare={moveTo}
              onPromotionPieceSelect={onPromotionPieceSelect}
              customSquareStyles={{
                ...moveSquares,
                ...optionSquares,
              }}
              onPieceDrop={onPieceDrop}
              customArrows={arrows}
              customBoardStyle={{
                transition: 'none',
                boxShadow: `0 4px 12px rgba(0,0,0,0.35),
                        inset 0 0 4px rgba(0,0,0,0.15)`,
              }}
              customDarkSquareStyle={{
                backgroundColor: '#B1B7C8',
              }}
              customLightSquareStyle={{
                backgroundColor: '#F5F2E6',
              }}
            />
          )}
        </div>

        {/* EvalBar sits flush to the right, no margin/padding */}
        <EvalBar score={evalScore} className="w-4" />
      </div>

      {/* 4) Engine continuation lines */}
      <div className="w-full max-w-lg">
        <MoveLines lines={lines} currentDepth={currentDepth} />
      </div>
    </div>
  );
}
