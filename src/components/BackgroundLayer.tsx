// src/components/BackgroundLayer.tsx
import { PATTERN_OPTIONS, BackgroundPattern } from '@/constants/background';
import { useStickyValue } from '@/hooks/useStickyValue';

export default function BackgroundLayer() {
  const [pattern] = useStickyValue<BackgroundPattern>('backgroundPattern', 'off');
  const option = PATTERN_OPTIONS.find((o) => o.value === pattern);
  if (!option || !option.class) return null;
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-0 ${option.class}`}
      aria-hidden="true"
    ></div>
  );
}
