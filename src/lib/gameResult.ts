// src/utils/gameResult.ts
/**
 * Normalize a PGN “result” string into a human-friendly reason.
 * e.g. "resigned" → "Resignation", "agreed" → "Draw by Agreement"
 */
export function getDisplayReason(rawReason: string | undefined): string {
  if (!rawReason) return '';

  const normalized = rawReason.toLowerCase();
  const fallback = rawReason
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  switch (normalized) {
    case 'resigned':
      return 'Resignation';
    case 'checkmated':
      return 'Checkmate';
    case 'abandoned':
      return 'Abandoned';
    case 'timeout':
      return 'Timeout';
    case 'stalemate':
      return 'Stalemate';
    case 'agreed':
      return 'Draw by Agreement';
    default:
      return fallback;
  }
}
