import { useEffect, useState } from 'react';

export function useScrollDirection(threshold = 50) {
  const [scrollUp, setScrollUp] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;

      if (currentY <= threshold) {
        setScrollUp(true);
      } else {
        setScrollUp(currentY < lastY);
      }

      lastY = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrollUp;
}
