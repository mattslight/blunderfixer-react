import { useEffect, useMemo, useRef } from 'react';

export type DrillResult = 'pass' | 'fail' | null;
export type GameResult = 'win' | 'loss' | 'draw' | null;
export type ExpectedResult = 'win' | 'draw' | 'hold' | null;

const DEBUG = false;
const MIN_DEPTH = 15;

interface UseDrillResultParams {
  initialEval: number | null;
  currentEval: number;
  currentDepth: number;
  heroSide: 'white' | 'black';
  maxMoves: number;
  isEndgame: boolean;
  lossThreshold: number;
  gameOver?: boolean;
  gameResult?: GameResult;
  resetKey: string | number;
  moveCount: number;
}

export function useDrillResult({
  resetKey,
  initialEval,
  currentEval,
  currentDepth,
  heroSide,
  maxMoves,
  isEndgame,
  lossThreshold,
  gameOver,
  gameResult,
  moveCount,
}: UseDrillResultParams) {
  const latchedResult = useRef<DrillResult>(null);
  const latchedReason = useRef<string | null>(null);

  useEffect(() => {
    latchedResult.current = null;
    latchedReason.current = null;
  }, [resetKey]);

  const expectedResult: ExpectedResult = useMemo(() => {
    if (initialEval == null) return null;
    if (heroSide === 'white') {
      if (initialEval >= 100) return 'win';
      if (initialEval <= -100) return 'hold';
    } else {
      if (initialEval <= -100) return 'win';
      if (initialEval >= 100) return 'hold';
    }
    return 'draw';
  }, [initialEval, heroSide]);

  useMemo(() => {
    if (
      latchedResult.current !== null ||
      initialEval == null ||
      currentDepth < MIN_DEPTH ||
      moveCount === 0
    ) {
      return;
    }

    const evalDelta =
      heroSide === 'white'
        ? initialEval - currentEval
        : currentEval - initialEval;

    const heroEval = heroSide === 'white' ? currentEval : -currentEval;

    let result: DrillResult = null;
    let reason: string | null = null;

    if (evalDelta >= 2000) {
      result = 'fail';
      reason = 'Oops — you hung mate';
    } else if (evalDelta >= 300) {
      result = 'fail';
      reason = 'You blundered a piece';
    } else if (isEndgame) {
      if (expectedResult === 'draw') {
        if (heroEval <= -200) {
          result = 'fail';
          reason = 'You let the draw slip 🤨';
        } else if (gameOver && gameResult === 'draw') {
          result = 'pass';
          reason = 'You held the draw 😅';
        } else if (gameOver && gameResult === 'loss') {
          result = 'fail';
          reason = 'You lost a drawn endgame';
        } else if (moveCount >= maxMoves) {
          result = 'pass';
          reason = 'Solid technique, you kept the balance';
        }
      } else if (expectedResult === 'win') {
        if (heroEval <= 0) {
          result = 'fail';
          reason = 'You lost a winning position 😭';
        } else if (gameOver && gameResult === 'win') {
          result = 'pass';
          reason = 'You converted the win — great job!';
        } else if (gameOver && gameResult === 'draw') {
          result = 'fail';
          reason = 'You let the win slip to a draw';
        } else if (gameOver && gameResult === 'loss') {
          result = 'fail';
          reason = 'You lost a winning game 😖';
        } else if (moveCount >= maxMoves) {
          result = 'pass';
          reason = 'You kept the winning edge!';
        }
      } else {
        if (evalDelta >= lossThreshold && moveCount > 1) {
          result = 'fail';
          reason = 'Defensive chances missed 😓';
        } else if (
          gameOver &&
          gameResult === 'draw' &&
          expectedResult === 'hold'
        ) {
          result = 'pass';
          reason = 'Good save — you held the draw 🙌🏻';
        } else if (moveCount >= maxMoves) {
          result = 'pass';
          reason = 'You held firm under pressure — great save!';
        }
      }
    } else {
      if (evalDelta >= lossThreshold && moveCount > 1) {
        result = 'fail';
        reason =
          expectedResult === 'win'
            ? 'You lost a winning position 😭'
            : expectedResult === 'draw'
              ? 'You let the draw slip 🤨'
              : 'Defensive chances missed 😓';
      } else if (moveCount >= maxMoves) {
        result = 'pass';
        reason = 'Solid play — good job!';
      }
    }

    latchedResult.current = result;
    latchedReason.current = reason;

    if (DEBUG) {
      console.log('— useDrillResult debug —');
      console.log({
        resetKey,
        result,
        initialEval,
        currentEval,
        currentDepth,
        evalDelta,
        heroEval,
        expectedResult,
      });
    }
  }, [
    resetKey,
    initialEval,
    currentEval,
    currentDepth,
    heroSide,
    maxMoves,
    isEndgame,
    lossThreshold,
    gameOver,
    gameResult,
    moveCount,
    expectedResult,
  ]);

  return {
    result: latchedResult.current,
    reason: latchedReason.current,
    expectedResult,
  };
}
