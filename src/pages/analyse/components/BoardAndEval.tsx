// src/pages/analyse/components/BoardAndEval.tsx
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';

import ContinuationToggle from './ContinuationToggle';
import EvalBar from './EvalBar';

import MoveStepper from '@/components/MoveStepper';
import ToggleSwitch from '@/components/ToggleSwitch';
import { useStickyValue } from '@/hooks/useStickyValue';

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
  boardOrientation = 'white' as 'white' | 'black',
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [moveListViewMode, setMoveListViewMode] = useStickyValue<
    'simple' | 'advanced'
  >('moveListViewMode', 'simple');
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

  const currentDepth = Math.max(
    lines[0]?.depth,
    lines[1]?.depth,
    lines[2]?.depth,
    0
  );

  return (
    <div className="flex flex-col items-center space-y-2">
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
              boardOrientation={boardOrientation}
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
              customNotationStyle={{
                fontSize: '0.75rem',
                color: 'oklch(55.1% 0.027 264.364)',
                fontWeight: 700,
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
        <EvalBar
          score={evalScore}
          className="w-4"
          boardOrientation={boardOrientation}
        />
      </div>

      {/* 4) Engine continuation lines */}
      <div className="w-full max-w-lg px-2 sm:p-0">
        <div className="flex flex-row items-center justify-between text-sm text-stone-400">
          <div>
            <ToggleSwitch
              checked={moveListViewMode === 'advanced'}
              onChange={() =>
                setMoveListViewMode((m) =>
                  m === 'simple' ? 'advanced' : 'simple'
                )
              }
              label="Full lines"
            />
          </div>
          <div className="text-xs text-stone-500">
            (<i>depth {currentDepth}</i>)
          </div>
        </div>
        <div className="mt-2 space-y-1">
          <ContinuationToggle
            lines={lines}
            view={moveListViewMode}
            currentDepth={currentDepth}
          />
        </div>
      </div>
    </div>
  );
}
