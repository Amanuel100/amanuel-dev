import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from '@/lib/gsap';
import { useSmoothScroll } from './SmoothScrollProvider';

export default function RouteTransition() {
  const { pathname, hash } = useLocation();
  const { scrollTo } = useSmoothScroll();
  const previous = useRef(pathname);

  useEffect(() => {
    if (hash) {
      const timer = window.setTimeout(() => {
        scrollTo(hash);
      }, 80);
      return () => clearTimeout(timer);
    }
    if (previous.current !== pathname) {
      previous.current = pathname;
      scrollTo(0, true);
      const main = document.getElementById('main');
      main?.focus({ preventScroll: true });
    }
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => clearTimeout(refreshTimer);
  }, [pathname, hash, scrollTo]);

  return null;
}
