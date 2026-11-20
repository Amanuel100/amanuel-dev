import { useEffect, useRef } from 'react';
import { useMotionValue } from 'framer-motion';
import { useSmoothScroll } from '@/components/SmoothScrollProvider';
import { clamp } from '@/lib/utils';
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null); const progress = useMotionValue(0); const { lenis } = useSmoothScroll();
  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (el) { const box = el.getBoundingClientRect(); progress.set(clamp(-box.top / Math.max(1, el.offsetHeight - window.innerHeight))); }
      else progress.set(clamp(window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)));
    };
    update(); lenis?.on('scroll', update); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update);
    return () => { lenis?.off('scroll', update); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [lenis, progress]);
  return { progress, ref };
}
