// src/pages/drills/components/DrillBanner.tsx
import React, { useMemo } from 'react';
import { Crosshair, RotateCcw, SkipForward, StepForward } from 'lucide-react';

interface Props {
  expectedResult: 'win' | 'draw' | 'hold' | null;
  drillResult: 'pass' | 'fail' | null;
  reason: string | null;
  setResetKey: React.Dispatch<React.SetStateAction<number>>;
  onNext: () => void;
  initialEval?: number;
  isEndgame?: boolean;
}

function getRandomMessage(messages: string[]) {
  return messages[Math.floor(Math.random() * messages.length)];
}

export default function DrillBanner({
  expectedResult,
  drillResult,
  reason,
  setResetKey,
  onNext,
  initialEval,
  isEndgame = false,
}: Props) {
  const drawMessage = useMemo(
    () =>
      getRandomMessage([
        'Stay solid',
        'Maintain equity',
        'Play for balance',
        'Hold the line',
        'Stay sharp and be patient',
        "Don't give an inch",
      ]),
    []
  );

  const holdMessage = useMemo(
    () =>
      getRandomMessage([
        'Defend like Gurkesh!',
        'Make it hard to win',
        'Dig in and fight back',
        'Test their technique',
        'Stay resilient',
        'Don’t collapse',
        'Force them to earn it',
        'Hold fast under fire',
      ]),
    []
  );

  const convertMessage = useMemo(
    () =>
      getRandomMessage([
        'Find the win',
        'Punish their mistake',
        'Finish strong',
        'Spot the tactic',
        'Convert your advantage',
        'Don’t miss the knockout',
      ]),
    []
  );

  const maintainMessage = useMemo(
    () =>
      getRandomMessage([
        'Keep the edge',
        'Play precise',
        'Don’t let it slip',
        'Squeeze slowly',
        'Keep control',
        'Maintain your advantage',
        'Stay patient, stay ahead',
      ]),
    []
  );

  return (
    <div className="xs:p-0 flex w-full flex-col items-center space-y-2 px-4">
      {/* Drill Goal Banner (only show before result) */}
      {expectedResult && !drillResult && (
        <div className="flex w-full items-center justify-between rounded border border-purple-500 bg-purple-900 px-4 py-2 text-center text-purple-200">
          <div>
            <Crosshair className="relative bottom-0.25 mr-2 inline-flex h-4 w-4 text-purple-400" />
            <span className="text-sm">
              <span className="mr-1 font-bold text-white/80">
                {isEndgame && 'Play until the end — '}
                {expectedResult === 'win' &&
                  initialEval !== undefined &&
                  (initialEval >= 200 ? convertMessage : maintainMessage)}
                {expectedResult === 'hold' && holdMessage}
                {expectedResult === 'draw' && drawMessage}
              </span>
            </span>
          </div>
          <button
            onClick={onNext}
            className="inline-flex items-center self-end rounded-md bg-stone-600 px-2 py-1 text-xs font-medium text-stone-400 hover:bg-stone-700"
          >
            Skip Drill
            <SkipForward className="ml-1 inline-flex h-3 w-3" />
          </button>
        </div>
      )}

      {/* Drill Result Banner */}
      {drillResult && (
        <div
          className={`flex w-full items-center justify-between space-x-2 rounded-md px-4 py-2 text-center text-sm font-medium ${
            drillResult === 'pass'
              ? 'border border-green-500 bg-green-900 text-green-100'
              : 'border border-red-500 bg-red-900 text-red-100'
          }`}
        >
          <span>
            {drillResult === 'pass'
              ? `✅ ${reason ?? 'Great job!'}`
              : `❌ ${reason ?? 'Better luck next time.'}`}
          </span>
          <span className="space-x-2">
            {drillResult === 'fail' && (
              <button
                onClick={() => setResetKey((prev) => prev + 1)}
                className="inline-flex items-center rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
              >
                <RotateCcw className="mr-1 hidden h-3 w-3" />
                Retry
              </button>
            )}
            {drillResult === 'pass' && (
              <button
                onClick={() => setResetKey((prev) => prev + 1)}
                className="inline-flex items-center rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
              >
                <RotateCcw className="mr-1 hidden h-3 w-3" />
                Replay
              </button>
            )}
            <button
              onClick={onNext}
              className="inline-flex items-center self-end rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
            >
              {drillResult === 'pass' ? 'Next' : 'Skip'}{' '}
              <StepForward className="xs:inline-flex ml-1 hidden h-3 w-3" />
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
