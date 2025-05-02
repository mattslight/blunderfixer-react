import { useState } from 'react';

import { Button, Modal } from 'flowbite-react';

import BoardAndEval from './components/BoardAndEval';
import CoachAndChat from './components/CoachAndChat';
import GameLoader from './components/GameLoader';
import PasteForm from './components/PasteForm';

export default function AnalysePage() {
  const [pgndata, setPGN] = useState(null);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);

  const looksLikePGN = (raw) => /^\[Event/.test(raw) || /\d+\./.test(raw);

  const handlePaste = (raw) => {
    const unified = looksLikePGN(raw) ? raw : `[FEN "${raw}"]\n\n`;
    setPGN(unified);
    setPasteOpen(false);
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap justify-center gap-2 p-4">
        <Button onClick={() => setPasteOpen(true)}>Paste FEN/PGN</Button>
        <Button onClick={() => setGameOpen(true)}>Load Recent Game</Button>
        <Button color="failure" onClick={() => setPGN(null)}>
          New Analysis
        </Button>
      </div>

      {/* Two-column responsive layout */}
      <div className="flex h-full flex-col lg:flex-row">
        <div className="w-full p-4 lg:w-2/3">
          <BoardAndEval pgndata={pgndata} key={pgndata} />
        </div>
        <div className="w-full p-4 lg:w-1/3">
          <CoachAndChat pgndata={pgndata} />
        </div>
      </div>

      {/* Paste FEN/PGN Modal */}
      <Modal show={pasteOpen} onClose={() => setPasteOpen(false)}>
        <Modal.Header>Paste FEN or PGN</Modal.Header>
        <Modal.Body>
          <PasteForm onSubmit={handlePaste} />
        </Modal.Body>
      </Modal>

      {/* Load Recent Game Modal */}
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
