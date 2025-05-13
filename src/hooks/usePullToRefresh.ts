// hooks/usePullToRefresh.ts
import { useEffect } from 'react';

export function usePullToRefresh(onRefresh: () => void, threshold = 60) {
  useEffect(() => {
    let startY = 0;
    let isPulling = false;

    function onTouchStart(e: TouchEvent) {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (!isPulling) return;
      const deltaY = e.touches[0].clientY - startY;
      if (deltaY > threshold) {
        onRefresh();
        isPulling = false;
      }
    }

    function onTouchEnd() {
      isPulling = false;
    }

    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [onRefresh, threshold]);
}
