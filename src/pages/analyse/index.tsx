// src/pages/analyse/index.tsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AnalysisToolbar, PasteModal } from './components/AnalysisModals';
import BoardAndEval from './components/BoardAndEval';
import CoachAndChat from './components/CoachAndChat';
import useFeatureExtraction from './hooks/useFeatureExtraction';
import useGameInputParser from './hooks/useGameInputParser';
import useKeyboardNavigation from './hooks/useKeyboardNavigation';

import useAnalysisEngine from '@/hooks/useAnalysisEngine';
import useGameHistory from '@/hooks/useGameHistory';
import useMoveInput from '@/hooks/useMoveInput';

type AnalyseState = {
  pgn?: string;
  halfMoveIndex?: number;
  heroSide?: 'w' | 'b';
};

export default function AnalysePage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      navigate('.', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // cast only the `state` to our shape
  const {
    pgn: drilledPgn,
    halfMoveIndex,
    heroSide = 'w',
  } = (location.state as AnalyseState) || {};

  // 1) Pull once from router state, then freeze
  const [initialRawInput] = useState<string | null>(() => drilledPgn ?? null);
  const [initialStartAtIdx] = useState<number>(() =>
    halfMoveIndex !== undefined ? Math.max(0, halfMoveIndex - 1) : 0
  );
  const [initialHeroSide] = useState<'w' | 'b'>(() => heroSide);

  // 2) Raw input (can later be changed by paste or game-loader)
  const [rawInput, setRawInput] = useState(initialRawInput);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteError, setPasteError] = useState('');

  // 3) Parse PGN → initialFEN & sanHistory
  const { initialFEN, sanHistory, rawErrors } = useGameInputParser(rawInput);

  // 4) Game history with explicit startAtIdx
  const { fen, moveHistory, currentIdx, setIdx, makeMove, lastMove } =
    useGameHistory({
      initialFEN,
      initialMoves: sanHistory,
      startAtIdx: initialStartAtIdx,
      allowBranching: true,
    });

  // 5) Move input handlers (click/drag/promotion)
  const {
    to,
    showPromotionDialog,
    optionSquares,
    onSquareClick,
    onPieceDrop,
    onPromotionPieceSelect,
  } = useMoveInput(fen, (f, t, prom) => makeMove(f, t, prom));

  // 6) Feature extraction & analysis engine
  const { features, error: featuresError } = useFeatureExtraction(fen);
  const { lines, evalScore, legalMoves, bestMoveArrow } =
    useAnalysisEngine(fen);

  // 7) Keyboard navigation
  useKeyboardNavigation({
    currentIdx,
    maxIdx: moveHistory.length,
    onPrev: () => setIdx(currentIdx - 1),
    onNext: () => setIdx(currentIdx + 1),
  });

  // ——— Handlers —————————————————————————

  const handlePasteSubmit = (text: string | null) => {
    setRawInput(text);
    setPasteOpen(false);
    if (rawErrors.length) setPasteError(rawErrors.join('\n'));
  };

  const handleClear = () => {
    setRawInput(null);
    setPasteError('');
  };

  // ——— Render —————————————————————————

  return (
    <>
      <AnalysisToolbar
        onOpenPaste={() => setPasteOpen(true)}
        onOpenGames={() => navigate('/games')}
        onClear={handleClear}
      />

      {featuresError && <p className="text-red-500">{featuresError}</p>}

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <BoardAndEval
            fen={fen}
            evalScore={evalScore}
            lines={lines}
            arrows={[bestMoveArrow]}
            moveList={moveHistory}
            currentIdx={currentIdx}
            setCurrentIdx={setIdx}
            moveTo={to}
            optionSquares={optionSquares}
            onSquareClick={onSquareClick}
            onPieceDrop={onPieceDrop}
            onPromotionPieceSelect={onPromotionPieceSelect}
            showPromotionDialog={showPromotionDialog}
            lastMove={lastMove}
            boardOrientation={initialHeroSide === 'b' ? 'black' : 'white'}
          />
        </div>
        <div className="w-full lg:w-1/2">
          <CoachAndChat
            fen={fen}
            features={features}
            legalMoves={legalMoves}
            lines={lines}
            heroSide={initialHeroSide}
          />
        </div>
      </div>

      <PasteModal
        show={pasteOpen}
        error={pasteError}
        onClose={() => setPasteOpen(false)}
        onSubmit={handlePasteSubmit}
      />
    </>
  );
}
