import { createContext, useCallback, useContext, useEffect, useMemo, type PropsWithChildren } from 'react';
import type Lenis from '@studio-freight/lenis';
import { useLenis } from '@/hooks/useLenis';
import { ScrollTrigger } from '@/lib/gsap';
interface ScrollContext { lenis: Lenis | null; scrollTo: (target: number | string, immediate?: boolean) => void; stop: () => void; start: () => void }
const Context = createContext<ScrollContext | null>(null);
export function SmoothScrollProvider({ children }: PropsWithChildren) {
  const lenis = useLenis();
  const scrollTo = useCallback((target: number | string, immediate = false) => {
    if (lenis) lenis.scrollTo(target, { immediate, force: true });
    else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'instant' });
    else document.querySelector(target)?.scrollIntoView({ behavior: 'instant' });
  }, [lenis]);
  const stop = useCallback(() => lenis?.stop(), [lenis]); const start = useCallback(() => lenis?.start(), [lenis]);
  useEffect(() => () => { ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); }, []);
  const value = useMemo(() => ({ lenis, scrollTo, stop, start }), [lenis, scrollTo, stop, start]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useSmoothScroll() { const context = useContext(Context); if (!context) throw new Error('SmoothScrollProvider is required'); return context; }
