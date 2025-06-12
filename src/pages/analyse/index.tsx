// src/pages/analyse/index.tsx

import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AnalysisToolbar, PasteModal } from './components/AnalysisModals';
import BoardAndEval from './components/BoardAndEval';
//import CoachAndChat from './components/CoachAndChat';
import useFeatureExtraction from './hooks/useFeatureExtraction';
import useGameInputParser from './hooks/useGameInputParser';
import useKeyboardNavigation from './hooks/useKeyboardNavigation';

import useAnalysisEngine from '@/hooks/useAnalysisEngine';
import useGameHistory from '@/hooks/useGameHistory';
import useMoveInput from '@/hooks/useMoveInput';
import { uciToArrow } from '@/lib/uci';

type AnalyseState = {
  pgn?: string;
  halfMoveIndex?: number;
  heroSide?: 'w' | 'b';
};

export default function AnalysePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Clear any router state on mount. This must only run once to avoid
  // repeatedly replacing history which can cause `replaceState()` warnings.
  useEffect(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      navigate('.', { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cast router state to our shape
  const {
    pgn: drilledPgn,
    halfMoveIndex,
    heroSide = 'w',
  } = (location.state as AnalyseState) || {};

  // 1) Freeze the initial values from router state
  const [initialRawInput] = useState<string | null>(() => drilledPgn ?? null);
  const [initialStartAtIdx] = useState<number>(() =>
    halfMoveIndex !== undefined ? Math.max(0, halfMoveIndex - 1) : 0
  );
  const [initialHeroSide] = useState<'w' | 'b'>(() => heroSide);

  // 2) Raw PGN input (may be updated via PasteModal)
  const [rawInput, setRawInput] = useState<string | null>(initialRawInput);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteError, setPasteError] = useState('');

  // 3) Parse PGN → initialFEN & sanHistory
  const {
    initialFEN: parsedFEN,
    sanHistory: parsedHistory,
    rawErrors,
  } = useGameInputParser(rawInput);

  // ──────────────────────────────────────────────
  // ── Memoize before passing to useGameHistory ─────────
  // Make sure useGameHistory only sees new values when parsedFEN or parsedHistory truly change

  // Memoize the FEN string
  const initialFEN = useMemo(() => parsedFEN, [parsedFEN]);

  // Memoize the history array; its reference changes only when `parsedFEN` (hence parsedHistory) changes
  const sanHistory = useMemo(() => parsedHistory, [parsedFEN]);
  // ──────────────────────────────────────────────

  // 4) Game history: stepping & branching
  const { fen, moveHistory, currentIdx, setIdx, makeMove, lastMove } =
    useGameHistory({
      initialFEN,
      initialMoves: sanHistory,
      startAtIdx: initialStartAtIdx,
      allowBranching: true,
    });

  // 5) Move‐input handlers (click, drag/drop, promotion)
  const {
    to,
    showPromotionDialog,
    optionSquares,
    onSquareClick,
    onPieceDrop,
    onPromotionPieceSelect,
  } = useMoveInput(fen, makeMove);

  // 6) Feature extraction & analysis engine
  const { features: _features, error: featuresError } =
    useFeatureExtraction(fen);
  const {
    lines,
    evalScore,
    legalMoves: _leagalmoves,
    bestMoveUCI,
  } = useAnalysisEngine(fen);

  // 7) Keyboard navigation (← / → arrows, etc.)
  useKeyboardNavigation({
    currentIdx,
    maxIdx: moveHistory.length,
    onPrev: () => setIdx(currentIdx - 1),
    onNext: () => setIdx(currentIdx + 1),
  });

  // ─── Handlers ───────────────────────────────────────────────────

  const handlePasteSubmit = (text: string | null) => {
    setRawInput(text);
    setPasteOpen(false);
    if (rawErrors.length) {
      setPasteError(rawErrors.join('\n'));
    }
  };

  const handleClear = () => {
    setRawInput(null);
    setPasteError('');
  };

  // ─── Memoize arrows from bestMoveUCI ─────────────────────────────

  const memoizedArrows = useMemo(() => {
    return bestMoveUCI ? [uciToArrow(bestMoveUCI)] : [];
  }, [bestMoveUCI]);

  // ─── Render ─────────────────────────────────────────────────────

  return (
    <>
      <AnalysisToolbar
        onOpenPaste={() => setPasteOpen(true)}
        onOpenGames={() => navigate('/games')}
        onClear={handleClear}
      />

      {featuresError && <p className="text-red-500">{featuresError}</p>}

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ─── Left column: board + evaluation ─────────────────────────── */}
        <div className="w-full">
          {/* Enable coach&chat className="w-full lg:w-1/2" */}
          <BoardAndEval
            fen={fen}
            evalScore={evalScore}
            lines={lines}
            arrows={memoizedArrows}
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

        {/* ─── Right column: coach insights, chat, etc. ───────────────── */}
        {/* <div className="w-full lg:w-1/2">
          <CoachAndChat
            fen={fen}
            features={features}
            legalMoves={legalMoves}
            lines={lines}
            heroSide={initialHeroSide}
          />
        </div> */}
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
