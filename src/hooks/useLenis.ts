import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from './useReducedMotion';
export function useLenis() {
  const reduced = useReducedMotion(); const [lenis, setLenis] = useState<Lenis | null>(null);
  useEffect(() => {
    if (reduced) { setLenis(null); return; }
    const instance = new Lenis({ lerp: 0.08, duration: 1.2, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 2 });
    const tick = (time: number) => instance.raf(time * 1000);
    instance.on('scroll', ScrollTrigger.update);
    ScrollTrigger.defaults({ scroller: window });
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value?: number) {
        if (typeof value === 'number') instance.scrollTo(value, { immediate: true, force: true });
        return instance.scroll;
      },
      getBoundingClientRect: () => ({ top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }), pinType: 'fixed'
    });
    gsap.ticker.add(tick); setLenis(instance);
    return () => {
      gsap.ticker.remove(tick); instance.off('scroll', ScrollTrigger.update); instance.destroy();
      ScrollTrigger.scrollerProxy(document.documentElement);
    };
  }, [reduced]);
  return lenis;
}
