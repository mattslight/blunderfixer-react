import { useEffect, useState } from 'react';

export type DrillResult = 'pass' | 'fail' | null;
export type GameResult = 'win' | 'loss' | 'draw' | null;
export type ExpectedResult = 'win' | 'draw' | 'hold' | null;

const DEBUG = false;

interface UseDrillResultParams {
  initialEval: number | null;
  currentEval: number;
  heroSide: 'white' | 'black';
  maxMoves: number;
  lossThreshold: number;
  gameOver?: boolean;
  gameResult?: GameResult;
  resetKey: string | number;
  moveHistory: string[];
}

export function useDrillResult({
  resetKey,
  initialEval,
  currentEval,
  heroSide,
  maxMoves,
  lossThreshold,
  gameOver,
  gameResult,
  moveHistory,
}: UseDrillResultParams) {
  const [result, setResult] = useState<DrillResult>(null);
  const [reason, setReason] = useState<string | null>(null);

  const expectedResult: ExpectedResult = (() => {
    if (initialEval == null) return null;
    if (heroSide === 'white') {
      if (initialEval >= 50) return 'win';
      if (initialEval <= -50) return 'hold';
    } else {
      if (initialEval <= -50) return 'win';
      if (initialEval >= 50) return 'hold';
    }
    return 'draw';
  })();

  useEffect(() => {
    setResult(null);
    setReason(null);
  }, [resetKey]);

  useEffect(() => {
    if (initialEval == null) return;

    const moveCount = moveHistory.length;
    const evalDelta =
      heroSide === 'white'
        ? initialEval - currentEval
        : currentEval - initialEval;

    let newResult: DrillResult = null;
    let newReason: string | null = null;

    if (maxMoves > 0 && moveCount >= maxMoves) {
      newResult = 'pass';
      newReason = 'Solid play — good job!';
    } else if (evalDelta >= 2000) {
      newResult = 'fail';
      newReason = 'Oops — you hung mate';
    } else if (evalDelta >= 300) {
      newResult = 'fail';
      newReason = 'You blundered a piece';
    } else if (evalDelta >= lossThreshold && moveCount > 1) {
      newResult = 'fail';
      newReason = 'You let the advantage slip';
    } else if (maxMoves === 0 && gameOver && gameResult) {
      if (expectedResult === 'win' && gameResult === 'win') {
        newResult = 'pass';
        newReason = 'You converted the win — great job!';
      } else if (expectedResult === 'draw' && gameResult === 'draw') {
        newResult = 'pass';
        newReason = 'You held the draw 😅';
      } else if (expectedResult === 'win' && gameResult === 'loss') {
        newResult = 'fail';
        newReason = 'You lost a winning game 😖';
      } else if (expectedResult === 'win' && gameResult === 'draw') {
        newResult = 'fail';
        newReason = 'You let the win slip to a draw';
      } else if (expectedResult === 'hold' && gameResult === 'draw') {
        newResult = 'pass';
        newReason = 'Good save — you held the draw 🙌🏻';
      }
    }

    if (newResult !== null) {
      setResult(newResult);
      setReason(newReason);
    } else {
      // Clear results when no condition is met
      setResult(null);
      setReason(null);
    }

    if (DEBUG) {
      console.log('— useDrillResult debug —');
      console.log('moveCount:', moveCount);
      console.log('maxMoves:', maxMoves);
      console.log('initialEval:', initialEval);
      console.log('currentEval:', currentEval);
      console.log('evalDelta:', evalDelta);
      console.log('gameOver:', gameOver);
      console.log('gameResult:', gameResult);
      console.log('result:', newResult);
      console.log('reason:', newReason);
    }
  }, [
    moveHistory,
    currentEval,
    gameOver,
    gameResult,
    initialEval,
    lossThreshold,
    maxMoves,
    heroSide,
    expectedResult,
    resetKey,
  ]);

  return { result, expectedResult, reason };
}
