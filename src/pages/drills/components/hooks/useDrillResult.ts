import { useEffect, useState } from 'react';

export type DrillResult = 'pass' | 'fail' | null;
export type GameResult = 'win' | 'loss' | 'draw' | null;
export type ExpectedResult = 'win' | 'draw' | 'hold' | null;

const DEBUG = true;
const MIN_DEPTH = 18;

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
  const [result, setResult] = useState<DrillResult>(null);
  const [reason, setReason] = useState<string | null>(null);

  const expectedResult: ExpectedResult = (() => {
    if (initialEval == null) return null;
    if (heroSide === 'white') {
      if (initialEval >= 100) return 'win';
      if (initialEval <= -100) return 'hold';
    } else {
      if (initialEval <= -100) return 'win';
      if (initialEval >= 100) return 'hold';
    }
    return 'draw';
  })();

  useEffect(() => {
    setResult(null);
    setReason(null);
  }, [resetKey]);

  useEffect(() => {
    if (initialEval == null || currentDepth < MIN_DEPTH) {
      setResult(null);
      setReason(null);
      return;
    }

    if (result) return;

    const evalDelta =
      heroSide === 'white'
        ? initialEval - currentEval
        : currentEval - initialEval;
    const heroEval = heroSide === 'white' ? currentEval : -currentEval;

    let newResult: DrillResult = null;
    let newReason: string | null = null;

    if (moveCount > 0) {
      if (evalDelta >= 2000) {
        newResult = 'fail';
        newReason = 'Oops — you hung mate';
      } else if (evalDelta >= 300) {
        newResult = 'fail';
        newReason = 'You blundered a piece';
      } else if (isEndgame) {
        if (expectedResult === 'draw') {
          if (heroEval <= -200) {
            newResult = 'fail';
            newReason = 'You let the draw slip 🤨';
          } else if (gameOver && gameResult === 'draw') {
            newResult = 'pass';
            newReason = 'You held the draw 😅';
          } else if (gameOver && gameResult === 'loss') {
            newResult = 'fail';
            newReason = 'You lost a drawn endgame';
          } else if (moveCount >= maxMoves) {
            newResult = 'pass';
            newReason = 'Solid technique — you kept the balance ⚖️';
          }
        } else if (expectedResult === 'win') {
          if (heroEval <= 0) {
            newResult = 'fail';
            newReason = 'You lost a winning position 😭';
          } else if (gameOver && gameResult === 'win') {
            newResult = 'pass';
            newReason = 'You converted the win — great job!';
          } else if (gameOver && gameResult === 'draw') {
            newResult = 'fail';
            newReason = 'You let the win slip to a draw';
          } else if (gameOver && gameResult === 'loss') {
            newResult = 'fail';
            newReason = 'You lost a winning game 😖';
          } else if (moveCount >= maxMoves) {
            newResult = 'pass';
            newReason = 'You kept the winning edge!';
          }
        } else {
          if (evalDelta >= lossThreshold && moveCount > 1) {
            newResult = 'fail';
            newReason = 'Defensive chances missed 😓';
          } else if (
            gameOver &&
            gameResult === 'draw' &&
            expectedResult === 'hold'
          ) {
            newResult = 'pass';
            newReason = 'Good save — you held the draw 🙌🏻';
          } else if (moveCount >= maxMoves) {
            newResult = 'pass';
            newReason = 'You held firm under pressure — great save!';
          }
        }
      } else {
        if (evalDelta >= lossThreshold && moveCount > 1) {
          newResult = 'fail';
          if (expectedResult === 'win') {
            newReason = 'You lost a winning position 😭';
          } else if (expectedResult === 'draw') {
            newReason = 'You let the draw slip 🤨';
          } else if (expectedResult === 'hold') {
            newReason = 'Defensive chances missed 😓';
          }
        } else if (moveCount >= maxMoves) {
          newResult = 'pass';
          newReason = 'Solid play — good job!';
        }
      }
    }

    if (newResult !== null) {
      setResult(newResult);
      setReason(newReason);
    } else {
      setResult(null);
      setReason(null);
    }

    if (DEBUG) {
      console.log('— useDrillResult debug —');
      console.log('moveCount:', moveCount);
      console.log('maxMoves:', maxMoves);
      console.log('initialEval:', initialEval);
      console.log('currentEval:', currentEval);
      console.log('currentDepth:', currentDepth);
      console.log('evalDelta:', evalDelta);
      console.log('gameOver:', gameOver);
      console.log('gameResult:', gameResult);
      console.log('newResult:', newResult);
      console.log('result:', result);
      console.log('reason:', newReason);
    }
  }, [
    currentEval,
    gameOver,
    gameResult,
    initialEval,
    lossThreshold,
    maxMoves,
    heroSide,
    expectedResult,
    resetKey,
    moveCount,
    currentDepth,
    isEndgame,
    result,
  ]);

  return { result, expectedResult, reason };
}
