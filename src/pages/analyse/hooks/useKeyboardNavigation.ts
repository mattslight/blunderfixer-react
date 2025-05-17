// hooks/useKeyboardNavigation.ts
import { useEffect } from 'react';

interface UseKeyboardNavigationProps {
  currentIdx: number;
  maxIdx: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function useKeyboardNavigation({
  currentIdx,
  maxIdx,
  onPrev,
  onNext,
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIdx > 0) onPrev();
      if (e.key === 'ArrowRight' && currentIdx < maxIdx) onNext();
    };
    window.addEventListener('keydown', onKey, { capture: true });
    return () =>
      window.removeEventListener('keydown', onKey, { capture: true });
  }, [currentIdx, maxIdx, onPrev, onNext]);
}
