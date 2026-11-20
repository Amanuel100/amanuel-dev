import { useLayoutEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
export default function RevealImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null); const reduced = useReducedMotion();
  useLayoutEffect(() => {
    if (reduced) return;
    const context = gsap.context(() => {
      gsap.fromTo(ref.current, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.inOut', scrollTrigger: { trigger: ref.current, start: 'top 95%', once: true } });
      gsap.fromTo('img', { scale: 1.2 }, { scale: 1, duration: 1.4, scrollTrigger: { trigger: ref.current, start: 'top 95%', once: true } });
    }, ref); return () => context.revert();
  }, [reduced]);
  return <div ref={ref} className={`reveal-image ${className}`}><img src={src} alt={alt} loading="lazy" decoding="async" width="1200" height="900" /></div>;
}
