import { useState } from 'react';

import useAnalysisEngine from './useAnalysisEngine';
import useCoachExplanation from './useCoachExplanation';
import useMoveHistory from './useMoveHistory';
import useMoveInput from './useMoveInput';
import usePGNParser from './usePGNParser';

export function useGameAnalysis(initialPGN = null) {
  const [pgndata, setPGN] = useState(initialPGN);

  const { initialFEN, sanHistory } = usePGNParser(pgndata);
  const { boardFEN, history, currentIdx, setIdx, applyMove } = useMoveHistory(
    initialFEN,
    sanHistory
  );
  const analysis = useAnalysisEngine(boardFEN);
  const input = useMoveInput(boardFEN, applyMove);
  const coach = useCoachExplanation();

  return {
    // PGN & navigation
    pgndata,
    setPGN,
    moveList: history,
    currentIdx,
    setCurrentIdx: setIdx,

    // board & input
    boardFEN,
    handleSquareClick: input.onSquareClick,
    handleDrop: input.onPieceDrop,
    showPromotionDialog: input.showPromo,
    onPromotionPieceSelect: input.onPromotion,
    optionSquares: input.options,

    // engine & UI
    ...analysis,

    // coach
    explanation: coach.explanation,
    getExplanation: coach.getExplanation,
    loadingExplanation: coach.loading,
    error: analysis.error || coach.error,
  };
}
