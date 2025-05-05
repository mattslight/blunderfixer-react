import { Clipboard, ClockPlus, Trash2 } from 'lucide-react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'flowbite-react';
import GameLoader from './GameLoader';

export function AnalysisToolbar({ onOpenPaste, onOpenGames, onClear }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 p-4">
      <Button
        onClick={onOpenGames}
        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700"
      >
        <ClockPlus className="h-5 w-5" /> Recent Games
      </Button>
      <Button
        onClick={onOpenPaste}
        className="flex items-center gap-2 rounded-lg bg-purple-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-purple-800"
      >
        <Clipboard className="h-5 w-5" /> Paste PGN
      </Button>
      <Button
        onClick={onClear}
        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700"
      >
        <Trash2 className="h-5 w-5" /> Clear
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
            className="h-40 w-full bg-gray-900"
            placeholder="Paste a FEN or full PGN here…"
          />
        </ModalBody>
        <ModalFooter className="flex justify-end gap-2">
          <Button onClick={onClose} className="bg-gray-900 px-6 py-2">
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
