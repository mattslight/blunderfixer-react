import type { PVLine } from '@/types';
import MoveLines from './MoveLines';
import TopmovesCarousel from './TopmovesCarousel';

interface ContinuationToggleProps {
  lines: PVLine[];
  view: 'simple' | 'advanced';
  currentDepth: number;
}

export default function MoveList({
  lines,
  view,
  currentDepth = 0,
}: ContinuationToggleProps) {
  // for MoveLines we need the depth; pull from the first line

  return view === 'simple' ? (
    <TopmovesCarousel lines={lines} />
  ) : (
    <MoveLines lines={lines} currentDepth={currentDepth} />
  );
}
