// src/pages/analyse/index.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import useMoveInput from '@/pages/analyse/hooks/useMoveInput';
import {
  AnalysisToolbar,
  GameLoaderModal,
  PasteModal,
} from './components/AnalysisModals';
import BoardAndEval from './components/BoardAndEval';
import CoachAndChat from './components/CoachAndChat';
import useAnalysisEngine from './hooks/useAnalysisEngine';
import useFeatureExtraction from './hooks/useFeatureExtraction';
import useGameHistory from './hooks/useGameHistory';
import useGameInputParser from './hooks/useGameInputParser';

type AnalyseState = {
  pgn?: string;
  halfMoveIndex?: number;
};

export default function AnalysePage() {
  const [rawInput, setRawInput] = useState<string | null>(null);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteError, setPasteError] = useState('');
  const [gameOpen, setGameOpen] = useState(false);

  // parse FEN/PGN or fallback
  const { initialFEN, sanHistory, rawErrors } = useGameInputParser(rawInput);

  const { fen, moveHistory, currentIdx, setIdx, makeMove, lastMove } =
    useGameHistory({
      initialFEN,
      initialMoves: sanHistory,
      startAtEnd: true,
      allowBranching: true,
    });

  // fetch positional features whenever `fen` changes
  const {
    features,
    loading: loadingFeatures,
    error: featuresError,
  } = useFeatureExtraction(fen);

  // 1) keyboard navigation
  //    (left/right arrows to step through history)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      console.log('onKey', e.key);
      console.log('currentIdx', currentIdx);

      if (e.key === 'ArrowLeft' && currentIdx > 0) {
        setIdx(currentIdx - 1);
      }
      if (e.key === 'ArrowRight' && currentIdx < moveHistory.length) {
        setIdx(currentIdx + 1);
      }
    };
    window.addEventListener('keydown', onKey, { capture: true });
    return () =>
      window.removeEventListener('keydown', onKey, { capture: true });
  }, [currentIdx, moveHistory.length, setIdx]);

  // Handlers
  const handlePasteSubmit = (text: string | null) => {
    setRawInput(text);
    setPasteOpen(false);
    if (rawErrors.length) setPasteError(rawErrors.join('\n'));
  };

  const handleGameSelect = (pgn: string) => {
    setRawInput(pgn);
    setPasteError('');
    setGameOpen(false);
  };

  const handleClear = () => {
    // Clear history: reset to default
    setRawInput(null);
    setPasteError('');
  };

  // 2) engine analysis (arrows, eval, lines)
  const { lines, currentDepth, evalScore, legalMoves, bestMoveArrow } =
    useAnalysisEngine(fen);

  const error = '';

  // 3) click/drag + promotion
  const {
    from,
    to,
    showPromotionDialog,
    optionSquares,
    onSquareClick,
    onPieceDrop,
    onPromotionPieceSelect,
  } = useMoveInput(fen, (f, t, prom) => makeMove(f, t, prom));

  // ———————————————————————————————
  // grab the drill state
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const { pgn, halfMoveIndex } = (location.state as AnalyseState) || {};
    if (pgn) {
      // 1) load the PGN
      setRawInput(pgn);
      setPasteError('');
      setGameOpen(false);

      // 2) once history is built, jump to that half-move
      //    (you might need to tweak timing if sanHistory isn’t ready immediately)
      setIdx(halfMoveIndex ?? 0);

      // scrub the location.state so back/forward doesn’t re-fire this
      navigate('.', { replace: true, state: {} });
    }
  }, []); // run once on mount

  // ———————————————————————————————

  return (
    <>
      <AnalysisToolbar
        onOpenPaste={() => setPasteOpen(true)}
        onOpenGames={() => navigate('/games/')}
        onClear={handleClear}
      />
      {/* Errors */}
      {error && <p className="text-center text-red-500">{error}</p>}
      {featuresError && (
        <p className="mt-2 text-sm text-red-500">{featuresError}</p>
      )}

      {/* Two-column layout */}
      <div className="flex flex-col justify-center gap-y-4 p-2 lg:flex-row lg:gap-x-16">
        <div className="w-full lg:w-auto lg:max-w-xl">
          <BoardAndEval
            evalScore={evalScore}
            fen={fen}
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
          />
        </div>
        <div className="lg:max-w-xl] w-full lg:w-auto">
          <CoachAndChat
            lines={lines}
            features={features}
            fen={fen}
            legalMoves={legalMoves}
          />
        </div>
      </div>
      {/* Modals */}
      <PasteModal
        show={pasteOpen}
        error={pasteError}
        onClose={() => setPasteOpen(false)}
        onSubmit={handlePasteSubmit}
      />

      <GameLoaderModal
        show={gameOpen}
        onClose={() => setGameOpen(false)}
        onSelectPGN={handleGameSelect}
      />
    </>
  );
}
