import { useEffect, useState } from 'react';

import { Chess } from 'chess.js';

const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export default function usePGNParser(rawPGN) {
  const [initialFEN, setInitialFEN] = useState(DEFAULT_FEN);
  const [sanHistory, setSanHistory] = useState([]);

  useEffect(() => {
    if (!rawPGN) {
      setInitialFEN(DEFAULT_FEN);
      setSanHistory([]);
      return;
    }
    if (rawPGN.startsWith('[FEN')) {
      const fen = rawPGN.match(/\[FEN "([^"]+)"/)[1];
      setInitialFEN(fen);
      setSanHistory([]);
    } else {
      const chess = new Chess();
      chess.loadPgn(rawPGN);
      setSanHistory(chess.history());
      setInitialFEN(chess.reset().fen());
    }
  }, [rawPGN]);

  return { initialFEN, sanHistory };
}
