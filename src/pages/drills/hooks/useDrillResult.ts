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

  // Determine expectedResult (null if initialEval missing)
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
  }, [resetKey]);

  useEffect(() => {
    const moveCount = moveHistory.length; // 👈 Use moveHistory as the source of truth

    if (DEBUG) {
      console.log('— useDrillResult debug —');
      console.log('moveCount:', moveCount);
      console.log('maxMoves:', maxMoves);
      console.log('initialEval:', initialEval);
      console.log('currentEval:', currentEval);
      console.log('gameOver:', gameOver);
      console.log('gameResult:', gameResult);
      console.log('result:', result);
    }

    if (initialEval == null) return;

    const evalDelta =
      heroSide === 'white'
        ? initialEval - currentEval
        : currentEval - initialEval;

    if (evalDelta >= lossThreshold) {
      setResult('fail');
      return;
    }

    if (maxMoves > 0 && moveCount >= maxMoves) {
      setResult('pass');
      return;
    }

    if (maxMoves === 0 && gameOver && gameResult) {
      if (expectedResult === 'win' && gameResult === 'win') {
        setResult('pass');
      } else if (expectedResult === 'draw' && gameResult === 'draw') {
        setResult('pass');
      } else {
        setResult('fail');
      }
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
    result,
    resetKey,
  ]);

  return {
    result,
    expectedResult,
  };
}
