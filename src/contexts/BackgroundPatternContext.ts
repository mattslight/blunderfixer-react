import { createContext } from 'react';

import { BackgroundPattern } from '@/constants/background';

export const BackgroundPatternContext = createContext<{
  pattern: BackgroundPattern;
  setPattern: (val: BackgroundPattern) => void;
} | null>(null);
