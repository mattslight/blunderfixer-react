import { useEffect, useState } from 'react';

export function useScrollDirection() {
  const [scrollUp, setScrollUp] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrollUp(currentY < lastY);
      lastY = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return scrollUp;
}
