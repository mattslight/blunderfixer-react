// src/pages/analyse/index.jsx
import useMoveInput from '@/pages/analyse/hooks/useMoveInput';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AnalysisToolbar,
  GameLoaderModal,
  PasteModal,
} from './components/AnalysisModals';
import BoardAndEval from './components/BoardAndEval';
import CoachAndChat from './components/CoachAndChat';
import useAnalysisEngine from './hooks/useAnalysisEngine';
import useGameHistory from './hooks/useGameHistory';
import useGameInputParser from './hooks/useGameInputParser';

export default function AnalysePage() {
  const [rawInput, setRawInput] = useState<string | null>(null);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteError, setPasteError] = useState('');
  const [gameOpen, setGameOpen] = useState(false);

  const navigate = useNavigate();

  // parse FEN/PGN or fallback
  const { initialFEN, sanHistory, rawErrors } = useGameInputParser(rawInput);

  const { fen, moveHistory, currentIdx, setIdx, makeMove, lastMove } =
    useGameHistory({
      initialFEN,
      initialMoves: sanHistory,
      startAtEnd: true,
      allowBranching: false,
    });

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
  const features = {}; // need to extract features using API call

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

  return (
    <div className="-mt-4">
      <AnalysisToolbar
        onOpenPaste={() => setPasteOpen(true)}
        onOpenGames={() => navigate('/games/')}
        onClear={handleClear}
      />
      {/* Error */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Two-column layout */}
      <div className="flex flex-col justify-center gap-y-4 p-2 lg:flex-row lg:gap-x-8">
        <div className="w-full lg:w-auto lg:max-w-xl">
          <BoardAndEval
            evalScore={evalScore}
            fen={fen}
            lines={lines}
            arrows={[bestMoveArrow]}
            currentDepth={currentDepth}
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
    </div>
  );
}
