import { useEffect, useState } from 'react';

export function useScrollDirection(threshold = 25, bottomBuffer = 50) {
  const [scrollUp, setScrollUp] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const currentY = Math.max(window.scrollY, 0);
      const scrollHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;

      const nearTop = currentY <= threshold;
      const nearBottom =
        currentY + viewportHeight >= scrollHeight - bottomBuffer;

      if (nearTop || nearBottom) {
        setScrollUp(true);
      } else {
        setScrollUp(currentY < lastY);
      }

      lastY = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold, bottomBuffer]);

  return scrollUp;
}
