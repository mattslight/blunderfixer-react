import { createContext } from 'react';

import { BackgroundPattern } from '@/const/background';

export const BackgroundPatternContext = createContext<{
  pattern: BackgroundPattern;
  setPattern: (val: BackgroundPattern) => void;
} | null>(null);
