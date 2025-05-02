// src/pages/analyse/index.jsx
import { useState } from 'react';

import { Button, Modal } from 'flowbite-react';

import { useGameAnalysis } from '../../hooks/useGameAnalysis';

import BoardAndEval from './components/BoardAndEval';
import CoachAndChat from './components/CoachAndChat';
import GameLoader from './components/GameLoader';
import PasteForm from './components/PasteForm';

export default function AnalysePage() {
  const [pasteOpen, setPasteOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);

  const {
    setPGN,

    boardFEN,
    lines,
    currentDepth,
    arrows,
    moveSquares,

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

  const looksLikePGN = (raw) => /^\[Event/.test(raw) || /\d+\./.test(raw);
  const handlePaste = (raw) => {
    const unified = looksLikePGN(raw) ? raw : `[FEN "${raw}"]\n\n`;
    setPGN(unified);
    setPasteOpen(false);
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-4">
        <Button onClick={() => setPasteOpen(true)}>Paste FEN/PGN</Button>
        <Button onClick={() => setGameOpen(true)}>Load Recent Game</Button>
        <Button color="failure" onClick={() => setPGN(null)}>
          New Analysis
        </Button>
      </div>

      {/* Error */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Two-column layout */}
      <div className="flex h-full flex-col lg:flex-row">
        {/* Left pane */}
        <div className="w-full p-4 lg:w-1/2">
          <BoardAndEval
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
      <Modal show={pasteOpen} onClose={() => setPasteOpen(false)}>
        <Modal.Header>Paste FEN or PGN</Modal.Header>
        <Modal.Body>
          <PasteForm onSubmit={handlePaste} />
        </Modal.Body>
      </Modal>

      {/* GameLoader Modal */}
      <Modal show={gameOpen} onClose={() => setGameOpen(false)}>
        <Modal.Header>Load Recent Game</Modal.Header>
        <Modal.Body>
          <GameLoader
            onSelectPGN={(pgn) => {
              setPGN(pgn);
              setGameOpen(false);
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}
