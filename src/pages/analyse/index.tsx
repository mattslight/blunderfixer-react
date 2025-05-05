// src/pages/analyse/index.jsx
import { useState } from 'react';

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'flowbite-react';
import { Clipboard, ClockPlus, Trash2 } from 'lucide-react';

import useGameInputParser from '@/hooks/useGameInputParser';
import useAnalysisEngine from '@/hooks/useAnalysisEngine';
import useGameHistory from '@/hooks/useGameHistory';
import useMoveInput from '@/hooks/useMoveInput';
import BoardAndEval from './components/BoardAndEval';
import CoachAndChat from './components/CoachAndChat';
import GameLoader from './components/GameLoader';

export default function AnalysePage() {
  const [rawInput, setRawInput] = useState<string | null>(null);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteError, setPasteError] = useState('');
  const [gameOpen, setGameOpen] = useState(false);

  // parse FEN/PGN or fallback
  const { initialFEN, sanHistory, rawErrors } = useGameInputParser(rawInput);

  const { fen, moveHistory, currentIdx, setIdx, makeMove } = useGameHistory({
    initialFEN,
    initialMoves: sanHistory,
    startAtEnd: true,
    allowBranching: false,
  });

  // 2) engine analysis (arrows, eval, lines)
  const { lines, currentDepth, evalScore, legalMoves, bestMoveArrow } =
    useAnalysisEngine(fen);

  const error = '';
  const moveSquares = {}; // need to add getLegalMoves and show moveSquares
  const features = {}; // need to extract features using API call

  const doClear = () => {
    alert('doClear clicked');
  };

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
          onClick={() => doClear()}
        >
          <Trash2 className="h-5 w-5" />
          Clear
        </Button>
      </div>
      {/* Error */}
      {error && <p className="text-center text-red-500">{error}</p>}
      {/* Two-column layout */}

      <div className="flex flex-col justify-center gap-y-4 p-4 lg:flex-row lg:gap-x-8">
        <div className="w-full lg:w-auto lg:max-w-xl">
          <BoardAndEval
            evalScore={evalScore}
            fen={fen}
            lines={lines}
            arrows={[bestMoveArrow]}
            moveSquares={moveSquares}
            currentDepth={currentDepth}
            moveList={moveHistory}
            currentIdx={currentIdx}
            setCurrentIdx={setIdx}
            moveFrom={from}
            moveTo={to}
            optionSquares={optionSquares}
            onSquareClick={onSquareClick}
            onPieceDrop={onPieceDrop}
            onPromotionPieceSelect={onPromotionPieceSelect}
            showPromotionDialog={showPromotionDialog}
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
            const form = e.target as any;
            const text = form.raw.value.trim() || null;
            setRawInput(text);
            setPasteOpen(false);
            // surface any parse errors
            if (rawErrors.length) {
              setPasteError(rawErrors.join('\n'));
            }
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
              console.log('PGN selected from game loader', pgn);
              setGameOpen(false);
            }}
          />
        </ModalBody>
      </Modal>
    </>
  );
}
