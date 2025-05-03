// src/pages/analyse/index.jsx
import { useState } from 'react';
import { Chess } from 'chess.js';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'flowbite-react';
import { Clipboard, ClockPlus, Trash2 } from 'lucide-react';

import { useGameAnalysis } from '../../hooks/useGameAnalysis';
import BoardAndEval from './components/BoardAndEval';
import CoachAndChat from './components/CoachAndChat';
import GameLoader from './components/GameLoader';

export default function AnalysePage() {
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteError, setPasteError] = useState('');
  const [gameOpen, setGameOpen] = useState(false);

  const {
    setPGN,

    boardFEN,
    lines,
    currentDepth,
    arrows,
    moveSquares,
    evalScore,

    features,
    error,
    legalMoves,

    explanation,
    loadingExplanation,
    getExplanation,

    moveList,
    currentIdx,
    setCurrentIdx,
    handleDrop,

    moveFrom,
    moveTo,
    showPromotionDialog,
    optionSquares,
    handleSquareClick,
    handlePromotionPieceSelect,
  } = useGameAnalysis();

  const looksLikePGN = (raw: string) => /^\s*\[/.test(raw) || /\d+\./.test(raw); // tags or move numbers
  const isBoardOnlyFEN = (raw: string) =>
    /^[rnbqkpRNBQKP1-8]+(\/[rnbqkpRNBQKP1-8]+){7}$/.test(raw.trim());

  function handlePaste(raw: string) {
    const chess = new Chess();
    setPasteError('');
    const trimmed = raw.trim();

    // If it's PGN (tags or "1."), parse only as PGN:
    if (looksLikePGN(trimmed)) {
      try {
        chess.loadPgn(trimmed, { strict: false });
        setPGN(trimmed);
        setPasteOpen(false);
      } catch (e) {
        setPasteError('? Invalid PGN: ' + (e as Error).message);
      }
      return;
    }

    // Otherwise it's FEN territory: maybe just board, so auto-complete:
    let fen = trimmed;
    if (isBoardOnlyFEN(trimmed)) {
      fen = `${trimmed} w - - 0 1`;
    }

    // Try loading FEN:
    try {
      chess.load(fen);
      setPGN(`[FEN "${fen}"]\n\n`);
      setPasteOpen(false);
    } catch (e) {
      setPasteError('? Invalid FEN: ' + (e as Error).message);
    }
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap justify-center gap-2 p-4">
        <Button
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700"
          onClick={() => setGameOpen(true)}
        >
          <ClockPlus className="h-5 w-5" />
          Recent Games
        </Button>
        <Button
          className="flex items-center gap-2 rounded-lg bg-purple-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-purple-800"
          onClick={() => setPasteOpen(true)}
        >
          <Clipboard className="h-5 w-5" />
          Paste PGN
        </Button>

        <Button
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700"
          onClick={() => setPGN(null)}
        >
          <Trash2 className="h-5 w-5" />
          Clear
        </Button>
      </div>

      {/* Error */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Two-column layout */}
      <div className="flex h-full flex-col lg:flex-row">
        {/* Left pane */}
        <div className="w-full p-4 lg:w-1/2">
          <BoardAndEval
            evalScore={evalScore}
            fen={boardFEN}
            lines={lines}
            arrows={arrows}
            moveSquares={moveSquares}
            currentDepth={currentDepth}
            moveList={moveList}
            currentIdx={currentIdx}
            setCurrentIdx={setCurrentIdx}
            setPGN={setPGN}
            moveFrom={moveFrom}
            moveTo={moveTo}
            showPromotionDialog={showPromotionDialog}
            optionSquares={optionSquares}
            handleSquareClick={handleSquareClick}
            handlePromotionPieceSelect={handlePromotionPieceSelect}
            handleDrop={handleDrop}
          />
        </div>

        {/* Right pane */}
        <div className="w-full space-y-4 p-4 lg:w-1/2">
          <CoachAndChat
            lines={lines}
            features={features}
            fen={boardFEN}
            legalMoves={legalMoves}
            explanation={explanation}
            loading={loadingExplanation}
            askCoach={() =>
              getExplanation({
                fen: boardFEN,
                lines,
                features,
                legal_moves: legalMoves,
              })
            }
          />
        </div>
      </div>

      {/* Paste Modal */}
      <Modal
        popup
        size="md"
        show={pasteOpen}
        onClose={() => setPasteOpen(false)}
        dismissible
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePaste(e.target.raw.value);
          }}
        >
          <ModalBody>
            {pasteError && (
              <p className="mb-2 text-sm text-red-400">{pasteError}</p>
            )}
            <textarea
              name="raw"
              className="h-40 w-full bg-gray-900"
              placeholder="Paste a FEN or full PGN here…"
              onChange={() => setPasteError('')}
            />
          </ModalBody>

          <ModalFooter className="flex justify-end gap-2">
            <Button
              className="bg-gray-900 px-6 py-2"
              onClick={() => setPasteOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-700 px-6 py-2">
              Load
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* GameLoader Modal */}
      <Modal show={gameOpen} onClose={() => setGameOpen(false)} popup size="lg">
        <ModalHeader>Load Recent Game</ModalHeader>
        <ModalBody>
          <GameLoader
            onSelectPGN={(pgn) => {
              setPGN(pgn);
              setGameOpen(false);
            }}
          />
        </ModalBody>
      </Modal>
    </>
  );
}
