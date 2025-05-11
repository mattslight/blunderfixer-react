// src/pages/analyse/components/CoachAndChat.jsx
import { Button } from 'flowbite-react';

import Chat from './Chat';
import CoachExplanation from './CoachExplanation';
import PositionFeatures from './PositionFeatures';

export default function CoachAndChat({
  lines,
  features,
  fen,
  legalMoves,
  explanation,
  loading,
  askCoach,
}) {
  return (
    <div className="mx-auto max-w-lg space-y-6 xl:w-xl xl:max-w-fit 2xl:w-2xl">
      {/* 2) Ask Coach button (only if no explanation) */}
      {!explanation && (
        <Button onClick={askCoach} disabled={loading} className="w-full">
          {loading ? 'Thinking…' : 'Get Coach Analysis'}
        </Button>
      )}

      {/* 3) Once you have explanation */}
      {explanation && <CoachExplanation explanation={explanation} />}

      {/* 4) Positional features */}
      <PositionFeatures features={features} />

      {/* 5) Chat panel */}
      <Chat fen={fen} legalMoves={legalMoves} />
    </div>
  );
}
