import type { PVLine } from '@/types';
import MoveLines from './MoveLines';
import TopmovesCarousel from './TopmovesCarousel';

interface MoveListProps {
  lines: PVLine[];
  view: 'simple' | 'advanced';
}

export default function MoveList({ lines, view }: MoveListProps) {
  // for MoveLines we need the depth; pull from the first line
  const depth = Math.max(lines[0]?.depth, lines[1]?.depth, lines[2]?.depth, 0);

  return view === 'simple' ? (
    <TopmovesCarousel lines={lines} />
  ) : (
    <MoveLines lines={lines} currentDepth={depth} />
  );
}
