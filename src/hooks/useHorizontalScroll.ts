import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from './useReducedMotion';
import { useMediaQuery } from './useMediaQuery';
export function useHorizontalScroll() {
  const section = useRef<HTMLElement>(null); const track = useRef<HTMLDivElement>(null); const bar = useRef<HTMLDivElement>(null);
  const mobile = useMediaQuery('(max-width: 767px)'); const reduced = useReducedMotion();
  useLayoutEffect(() => {
    if (!section.current || !track.current || reduced) return;
    const context = gsap.context(() => {
      if (mobile) { gsap.utils.toArray<HTMLElement>('.about-panel').forEach((panel) => gsap.from(panel, { y: 30, opacity: 0, scrollTrigger: { trigger: panel, start: 'top 90%', once: true } })); return; }
      const distance = () => Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth);
      const tween = gsap.to(track.current, { x: () => -distance(), ease: 'none', scrollTrigger: { trigger: section.current, pin: true, start: 'top top', end: () => `+=${distance()}`, scrub: 1, invalidateOnRefresh: true, onUpdate: (self) => { gsap.set(bar.current, { scaleX: self.progress }); } } });
      gsap.utils.toArray<HTMLElement>('.statement-word').forEach((word) => gsap.to(word, { color: '#f5f5f7', scrollTrigger: { trigger: word, containerAnimation: tween, start: 'left 65%', end: 'left 35%', scrub: true } }));
      gsap.fromTo('.signature-path', { strokeDashoffset: 1200 }, { strokeDashoffset: 0, scrollTrigger: { trigger: '.signature-panel', containerAnimation: tween, start: 'left 90%', end: 'left 20%', scrub: true } });
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((element) => { const counter = { value: 0 }; gsap.to(counter, { value: Number(element.dataset.count), duration: 1.5, ease: 'power2.out', onUpdate: () => { element.textContent = Math.round(counter.value).toString() + (element.dataset.suffix ?? ''); }, scrollTrigger: { trigger: element, containerAnimation: tween, start: 'left 95%', once: true } }); });
    }, section); ScrollTrigger.refresh(); return () => context.revert();
  }, [mobile, reduced]);
  return { section, track, bar };
}
