// src/hooks/useMoveInput.js
import { useState } from 'react';

import { Chess } from 'chess.js';

export default function useMoveInput(boardFEN, applyMove) {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [showPromo, setShowPromo] = useState(false);
  const [options, setOptions] = useState({});

  // highlight all legal destinations from `square`
  function getMoveOptions(square) {
    const chess = new Chess(boardFEN);
    const moves = chess.moves({ square, verbose: true });
    if (!moves.length) {
      setOptions({});
      return false;
    }
    const opts = {};
    moves.forEach((m) => {
      opts[m.to] = {
        background: chess.get(m.to)
          ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
          : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
      };
    });
    opts[square] = { background: 'rgba(255,255,0,0.4)' };
    setOptions(opts);
    return true;
  }

  function onSquareClick(square) {
    // clear previous highlights
    setOptions({});

    // 1) pick the `from` square
    if (!from) {
      if (getMoveOptions(square)) setFrom(square);
      return;
    }

    // 2) replay up to current position, then see if this is a legal to-square
    const chess = new Chess(boardFEN);
    const verbose = chess.moves({ verbose: true });
    const found = verbose.find((m) => m.from === from && m.to === square);

    if (!found) {
      // clicked elsewhere: restart from this new from
      if (getMoveOptions(square)) setFrom(square);
      else setFrom(null);
      return;
    }

    // 3) promotion?
    if (
      found.piece === 'p' &&
      ((found.color === 'w' && square[1] === '8') ||
        (found.color === 'b' && square[1] === '1'))
    ) {
      setTo(square);
      setShowPromo(true);
      return;
    }

    // 4) normal move
    applyMove(found.from, found.to, undefined);
    setFrom(null);
    setTo(null);
  }

  function onPieceDrop(fromSq, toSq, piece) {
    const chess = new Chess(boardFEN);
    const legalUci = chess.moves({ verbose: true }).map((m) => m.from + m.to);
    if (!legalUci.includes(fromSq + toSq)) {
      console.warn('Illegal drop', fromSq, toSq);
      return false;
    }
    const promo =
      piece[1] === 'p' && (toSq[1] === '8' || toSq[1] === '1')
        ? 'q'
        : undefined;
    applyMove(fromSq, toSq, promo);
    return true;
  }

  function onPromotion(choice) {
    applyMove(from, to, choice.toLowerCase());
    setFrom(null);
    setTo(null);
    setShowPromo(false);
  }

  return {
    from,
    to,
    showPromo,
    options,
    onSquareClick,
    onPieceDrop,
    onPromotion,
  };
}
