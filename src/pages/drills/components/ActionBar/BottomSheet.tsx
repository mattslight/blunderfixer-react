import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Archive, Clipboard, ExternalLink, X } from 'lucide-react';

interface DrillMenuBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysis: () => void;
  onArchive: () => void;
  onCopy: () => void;
}

export default function DrillMenuBottomSheet({
  isOpen,
  onClose,
  onAnalysis,
  onArchive,
  onCopy,
}: DrillMenuBottomSheetProps) {
  const swipeThreshold = 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Bottom sheet */}
          <motion.div
            className="fixed right-0 bottom-0 left-0 z-50 rounded-t-2xl bg-stone-900 p-4"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.y > swipeThreshold) {
                onClose();
              }
            }}
          >
            {/* Drag handle */}
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-stone-700" />

            {/* Close button */}
            <button
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              onClick={() => {
                onAnalysis();
                onClose();
              }}
              className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-stone-200 hover:bg-stone-800"
            >
              <ExternalLink className="h-5 w-5" />
              Analysis Board
            </button>
            <button
              onClick={() => {
                onCopy();
                onClose();
              }}
              className="mt-2 flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-stone-200 hover:bg-stone-800"
            >
              <Clipboard className="h-5 w-5" />
              Copy PGN/FEN
            </button>
            <button
              onClick={() => {
                onArchive();
                onClose();
              }}
              className="mt-2 flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-stone-200 hover:bg-stone-800"
            >
              <Archive className="h-5 w-5" />
              Archive Drill
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
