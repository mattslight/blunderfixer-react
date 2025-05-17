// src/pages/analyse/index.tsx
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import useAnalysisEngine from './hooks/useAnalysisEngine';
import useFeatureExtraction from './hooks/useFeatureExtraction';
import useGameHistory from './hooks/useGameHistory';
import useGameInputParser from './hooks/useGameInputParser';
import useKeyboardNavigation from './hooks/useKeyboardNavigation';

import {
  AnalysisToolbar,
  GameLoaderModal,
  PasteModal,
} from './components/AnalysisModals';
import BoardAndEval from './components/BoardAndEval';
import CoachAndChat from './components/CoachAndChat';

type AnalyseState = {
  pgn?: string;
  halfMoveIndex?: number;
};

export default function AnalysePage() {
  const location = useLocation<AnalyseState>();
  const navigate = useNavigate();

  // 1) Pull once from router state, then freeze
  const { pgn: drilledPgn, halfMoveIndex } = location.state || {};
  const [initialRawInput] = useState<string | null>(() => drilledPgn ?? null);
  const [initialStartAtIdx] = useState<number>(() =>
    halfMoveIndex !== undefined ? Math.max(0, halfMoveIndex - 1) : 0
  );

  // 2) Raw input (can later be changed by paste or game-loader)
  const [rawInput, setRawInput] = useState(initialRawInput);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteError, setPasteError] = useState('');
  const [gameOpen, setGameOpen] = useState(false);

  // 4) Parse PGN → initialFEN & sanHistory
  const { initialFEN, sanHistory, rawErrors } = useGameInputParser(rawInput);

  // 5) Game history with explicit startAtIdx
  const { fen, moveHistory, currentIdx, setIdx, makeMove, lastMove } =
    useGameHistory({
      initialFEN,
      initialMoves: sanHistory,
      startAtIdx: initialStartAtIdx,
      allowBranching: true,
    });

  console.log('[Board] currentIdx at render:', currentIdx);

  // 6) Feature extraction & analysis engine
  const {
    features,
    loading: loadingFeatures,
    error: featuresError,
  } = useFeatureExtraction(fen);
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

  const handleGameSelect = (pgn: string) => {
    setRawInput(pgn);
    setPasteError('');
    setGameOpen(false);
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
            moveTo={null} // or your `to` from useMoveInput
            optionSquares={[]}
            onSquareClick={() => {}}
            onPieceDrop={() => {}}
            onPromotionPieceSelect={() => {}}
            showPromotionDialog={false}
            lastMove={lastMove}
          />
        </div>
        <div className="w-full lg:w-1/2">
          <CoachAndChat
            fen={fen}
            features={features}
            legalMoves={legalMoves}
            lines={lines}
          />
        </div>
      </div>

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
