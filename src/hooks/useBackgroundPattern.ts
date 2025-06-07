import { useContext } from 'react';

import { BackgroundPatternContext } from '@/contexts/BackgroundPatternContext';

export function useBackgroundPattern() {
  const ctx = useContext(BackgroundPatternContext);
  if (!ctx)
    throw new Error(
      'useBackgroundPattern must be used within a BackgroundPatternProvider'
    );
  return ctx;
}
