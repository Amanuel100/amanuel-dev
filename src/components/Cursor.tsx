import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null); const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState(''); const touch = useMediaQuery('(hover: none)'); const reduced = useReducedMotion();
  useEffect(() => {
    if (touch || !ring.current || !dot.current) return;
    const ringElement = ring.current; const dotElement = dot.current;
    const x = gsap.quickTo(ring.current, 'x', { duration: reduced ? 0 : 0.15, ease: 'power2.out' });
    const y = gsap.quickTo(ring.current, 'y', { duration: reduced ? 0 : 0.15, ease: 'power2.out' });
    let last = '';
    const move = (e: PointerEvent) => {
      gsap.set(dot.current, { x: e.clientX, y: e.clientY }); x(e.clientX); y(e.clientY);
      const element = e.target instanceof Element ? e.target : null;
      const state = element?.closest('[data-cursor]')?.getAttribute('data-cursor') ?? (element?.closest('a,button,input,select,textarea') ? 'hover' : 'default');
      if (last !== state) {
        last = state; setLabel(state === 'view' ? 'VIEW' : state === 'drag' ? 'DRAG' : '');
        gsap.to(ring.current, { width: state === 'default' ? 40 : 80, height: state === 'default' ? 40 : 80, opacity: state === 'hidden' ? 0 : 1, filter: state === 'hover' ? 'blur(2px)' : 'blur(0px)', duration: reduced ? 0 : 0.2 });
        gsap.set(dot.current, { opacity: state === 'hidden' ? 0 : 1 });
      }
    };
    const leave = () => { gsap.set([ring.current, dot.current], { opacity: 0 }); last = ''; };
    document.addEventListener('pointermove', move, { passive: true }); document.addEventListener('pointerleave', leave);
    return () => { x.tween.kill(); y.tween.kill(); gsap.killTweensOf([ringElement, dotElement]); document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); };
  }, [touch, reduced]);
  if (touch) return null;
  return <div aria-hidden="true"><div ref={dot} className="cursor-dot" /><div ref={ring} className="cursor-ring">{label}</div></div>;
}

