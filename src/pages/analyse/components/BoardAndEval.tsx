// src/pages/analyse/components/BoardAndEval.jsx
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';

import EvalBar from './EvalBar';
//import ExamplePositions from './ExamplePositions';
import ToggleSwitch from '@/components/ToggleSwitch';
import MoveList from './MoveList';
import MoveStepper from './MoveStepper';

export default function BoardAndEval({
  fen,
  lines,
  arrows,
  evalScore,

  moveList,
  currentIdx,
  setCurrentIdx,
  lastMove = { from: '', to: '' },

  moveTo,
  optionSquares,
  onPieceDrop,
  onSquareClick,
  onPromotionPieceSelect,
  showPromotionDialog,
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [moveListViewMode, setMoveListViewMode] = useState<
    'simple' | 'advanced'
  >('simple');
  const [boardWidth, setBoardWidth] = useState(464);
  const [moveSquares, setMoveSquares] = useState<Record<string, CSSProperties>>(
    {}
  );

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

  // whenever lastMove updates, highlight the two squares
  useEffect(() => {
    if (lastMove.from && lastMove.to) {
      setMoveSquares({
        [lastMove.from]: { backgroundColor: 'rgba(255,255,0,0.4)' },
        [lastMove.to]: { backgroundColor: 'rgba(255,255,0,0.4)' },
      });
    } else {
      setMoveSquares({});
    }
  }, [lastMove.from, lastMove.to]);

  // 1) If no FEN yet, show your examples picker
  // if (!fen) {
  //   return (
  //     <div className="p-4">
  //       <ExamplePositions onPickFEN={(f) => setPGN(`[FEN "${f}"]\n\n`)} />
  //     </div>
  //   );
  // }

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
                ...optionSquares,
                ...moveSquares,
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
        <ToggleSwitch
          checked={moveListViewMode === 'advanced'}
          onChange={() =>
            setMoveListViewMode((m) => (m === 'simple' ? 'advanced' : 'simple'))
          }
          label="Full lines"
        />
        <MoveList lines={lines} view={moveListViewMode} />
      </div>
    </div>
  );
}
