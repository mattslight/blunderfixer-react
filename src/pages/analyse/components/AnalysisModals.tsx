import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'flowbite-react';
import { Clipboard, Clock, Trash2 } from 'lucide-react';

import GameLoader from './GameLoader';

export function AnalysisToolbar({ onOpenPaste, onOpenGames, onClear }) {
  return (
    <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm md:mt-4">
      <Button
        onClick={onOpenGames}
        className="flex items-center gap-1 rounded-none px-0 py-1.5 text-sm font-medium text-stone-400 shadow-sm transition-colors hover:text-white"
      >
        <Clock className="h-3 w-3" /> Recent
      </Button>
      <Button
        onClick={onOpenPaste}
        className="flex items-center gap-1 rounded-none px-0 py-1.5 text-sm font-medium text-stone-400 shadow-sm transition-colors hover:text-white"
      >
        <Clipboard className="h-3 w-3" /> Paste
      </Button>
      <Button
        onClick={onClear}
        className="flex items-center gap-1 rounded-none px-0 py-1.5 text-sm font-medium text-stone-400 shadow-sm transition-colors hover:text-white"
      >
        <Trash2 className="h-3 w-3" /> Reset
      </Button>
    </div>
  );
}

export function GameLoaderModal({ show, onClose, onSelectPGN }) {
  return (
    <Modal show={show} onClose={onClose} popup size="lg">
      <ModalHeader>Load Recent Game</ModalHeader>
      <ModalBody>
        <GameLoader onSelectPGN={(pgn) => onSelectPGN(pgn)} />
      </ModalBody>
    </Modal>
  );
}

export function PasteModal({ show, error, onClose, onSubmit }) {
  return (
    <Modal popup size="md" show={show} onClose={onClose} dismissible>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const text = (e.target as any).raw.value.trim() || null;
          onSubmit(text);
        }}
      >
        <ModalBody>
          {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
          <textarea
            name="raw"
            className="h-40 w-full bg-stone-900"
            placeholder="Paste a FEN or full PGN here…"
          />
        </ModalBody>
        <ModalFooter className="flex justify-end gap-2">
          <Button onClick={onClose} className="bg-stone-900 px-6 py-2">
            Cancel
          </Button>
          <Button type="submit" className="bg-purple-700 px-6 py-2">
            Load
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
