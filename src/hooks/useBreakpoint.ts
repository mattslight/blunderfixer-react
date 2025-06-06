export const BREAKPOINT_ORDER = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | null;

// src/util/useBreakpoint.ts
import { useEffect, useMemo, useState } from 'react';

import { isBrowser, off, on } from '@/lib/misc';

type Breakpoints = Record<string, number>;

export const breakpoints: Breakpoints = {
  xs: 480, // 30rem
  sm: 640, // Tailwind default
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export default function useBreakpoint() {
  const [width, setWidth] = useState(isBrowser ? window.innerWidth : 0);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    on(window, 'resize', onResize);
    return () => off(window, 'resize', onResize);
  }, []);

  const current = useMemo(() => {
    const sorted = Object.entries(breakpoints).sort(([, a], [, b]) => a - b);
    for (let i = sorted.length - 1; i >= 0; i--) {
      const [name, min] = sorted[i];
      if (width >= min) return name as Breakpoint;
    }
    return null; // < smallest breakpoint
  }, [width]);

  const isAtLeast = (min: Breakpoint) =>
    BREAKPOINT_ORDER.indexOf(current) >= BREAKPOINT_ORDER.indexOf(min);

  return { current, isAtLeast, screenWidth: width };
}
