import { useEffect, useState } from 'react';

export function useScrollDirection(threshold = 50) {
  const [scrollUp, setScrollUp] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const currentY = Math.max(window.scrollY, 0); // clamp to 0

      if (currentY <= threshold) {
        setScrollUp(true);
      } else {
        setScrollUp(currentY < lastY);
      }

      lastY = currentY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrollUp;
}
