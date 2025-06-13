import { Castle, Crown, Shield, Sword, Swords } from 'lucide-react';

export default function EndgameTrainer() {
  return (
    <div className="p-4 pt-8 2xl:ml-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-white">Endgame Trainer</h1>
        <p className="text-stone-400">
          Sharpen your technique with classic theoretical endings.
        </p>
        <ul className="space-y-8">
          <li>
            <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold text-white">
              <Crown className="h-5 w-5 text-green-500" /> King + Pawn vs. King
            </h2>
            <ul className="ml-8 list-disc space-y-1 text-stone-300">
              <li>Basic opposition (key squares, distant opposition)</li>
              <li>Outside vs. inside passed pawns</li>
              <li>W-h pawns (a/h-file stalemates)</li>
            </ul>
          </li>
          <li>
            <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold text-white">
              <Castle className="h-5 w-5 text-green-500" /> Pawn Structures
            </h2>
            <ul className="ml-8 list-disc space-y-1 text-stone-300">
              <li>Lucena position (winning with extra rook and pawn)</li>
              <li>Philidor position (drawing with rook and pawn down)</li>
              <li>Building a bridge</li>
              <li>Wrong bishop + rook pawn draw</li>
            </ul>
          </li>
          <li>
            <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold text-white">
              <Sword className="h-5 w-5 text-green-500" /> King + Rook vs. King
            </h2>
            <ul className="ml-8 list-disc space-y-1 text-stone-300">
              <li>Basic checkmate</li>
              <li>Edge-check technique (cut-off method)</li>
            </ul>
          </li>
          <li>
            <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold text-white">
              <Swords className="h-5 w-5 text-green-500" /> King + Rook + Pawn
              vs. King + Rook
            </h2>
            <ul className="ml-8 list-disc space-y-1 text-stone-300">
              <li>Lucena vs. Philidor in rook endings</li>
              <li>Short-side defence technique</li>
              <li>Checking from behind and the side</li>
            </ul>
          </li>
          <li>
            <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold text-white">
              <Shield className="h-5 w-5 text-green-500" /> King + Bishop +
              Knight vs. King
            </h2>
            <ul className="ml-8 list-disc space-y-1 text-stone-300">
              <li>
                Checkmate pattern (e.g. W-method) – rare, but worth one-time
                training
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
