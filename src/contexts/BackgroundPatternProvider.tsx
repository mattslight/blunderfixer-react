import React, { useEffect, useState } from 'react';

import { BackgroundPatternContext } from './BackgroundPatternContext';

import { BackgroundPattern } from '@/constants/background';

const PREFIX = 'bf:params:backgroundPattern';

export function BackgroundPatternProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pattern, setPatternState] = useState<BackgroundPattern>('boldmoves');

  useEffect(() => {
    const stored = localStorage.getItem(PREFIX);
    if (stored) setPatternState(JSON.parse(stored));
  }, []);

  const setPattern = (val: BackgroundPattern) => {
    setPatternState(val);
    localStorage.setItem(PREFIX, JSON.stringify(val));
  };

  return (
    <BackgroundPatternContext.Provider value={{ pattern, setPattern }}>
      {children}
    </BackgroundPatternContext.Provider>
  );
}
