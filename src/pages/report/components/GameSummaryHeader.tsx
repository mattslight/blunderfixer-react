import { formatDistanceToNow } from 'date-fns';

import { useProfile } from '@/hooks/useProfile';

export default function GameSummaryHeader({ game }) {
  const {
    profile: { username },
  } = useProfile();

  // white/black metadata
  const wMeta = game.meta.players.white;
  const bMeta = game.meta.players.black;

  // am I white or black?
  const side = username === wMeta.player.username ? 'white' : 'black';
  const youMeta = side === 'white' ? wMeta : bMeta;
  const oppMeta = side === 'white' ? bMeta : wMeta;

  // win/draw/loss via PGN tag
  const resultTag = game.meta.pgnTags?.Result || '';
  const won = resultTag === (side === 'white' ? '1-0' : '0-1');
  const lost = resultTag === (side === 'white' ? '0-1' : '1-0');

  // pick which .result to show
  const rawReason = won
    ? oppMeta.result // they lost → how they lost
    : lost
      ? youMeta.result // you lost → how you lost
      : oppMeta.result; // draw → usually "stalemate" or "agreed"

  // auto-capitalize fallback
  const reason = rawReason
    ?.replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // override verb → noun mapping
  const normalized = rawReason?.toLowerCase() || '';
  const displayReason =
    normalized === 'resigned'
      ? 'Resignation'
      : normalized === 'checkmated'
        ? 'Checkmate'
        : normalized === 'abandoned'
          ? 'Abandoned'
          : normalized === 'timeout'
            ? 'Timeout'
            : normalized === 'stalemate'
              ? 'Stalemate'
              : normalized === 'agreed'
                ? 'Draw by Agreement'
                : reason;

  // assume game.meta.endTime is seconds since epoch
  const dateObj = new Date(game.meta.endTime * 1000);
  const dateStr = formatDistanceToNow(dateObj, { addSuffix: true }).replace(
    /^about\s*/,
    ''
  );
  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="w-full">
        <div className="mt-1 flex items-center space-x-2">
          <span
            className={
              `rounded-full px-2 py-1 text-xs font-medium ` +
              (won
                ? 'bg-green-500 text-white'
                : lost
                  ? 'bg-red-500 text-white'
                  : 'bg-stone-600 text-white')
            }
          >
            {won ? 'You won' : lost ? 'You lost' : 'Draw'}
          </span>
          {displayReason && (
            <span className="text-sm text-stone-600">{displayReason}</span>
          )}
        </div>
        <h3 className="text-xl font-medium">
          {game.meta.players.white.player.username}{' '}
          <span className="text-2xl text-white">♞</span>{' '}
          <span className="px-4 text-lg text-stone-600">vs</span>{' '}
          {game.meta.players.black.player.username}{' '}
          <span className="text-2xl text-black [text-shadow:-0.5px_-0.5px_0_#4F46E5,0.5px_-0.5px_0_#4F46E5,-0.5px_0.5px_0_#4F46E5,0.5px_0.5px_0_#4F46E5]">
            ♞
          </span>
        </h3>

        <p className="text-sm font-medium text-stone-600">
          {dateStr} <span className="text-stone-800">•</span>{' '}
          {game.meta.timeControl / 60}m+{game.meta.increment}s{' '}
          <span className="text-stone-800">•</span> {game.meta.timeClass}
        </p>
      </div>
    </header>
  );
}
