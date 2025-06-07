// src/components/BackgroundLayer.tsx
import { PATTERN_OPTIONS } from '@/constants/background';
import { useBackgroundPattern } from '@/hooks/useBackgroundPattern';

export default function BackgroundLayer() {
  const { pattern } = useBackgroundPattern();
  const option = PATTERN_OPTIONS.find((o) => o.value === pattern);

  console.log('BackgroundLayer', option);
  if (!option || !option.bgImage) return null;
  return (
    <div
      className={[
        'pointer-events-none fixed inset-0 z-0 h-screen w-screen bg-repeat',
        option.sizeClass,
        option.opacityClass,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ backgroundImage: `url(${option.bgImage})` }}
      aria-hidden="true"
    />
  );
}
