import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from './useReducedMotion';
export function useTextReveal<T extends HTMLElement = HTMLHeadingElement>() {
  const ref = useRef<T>(null); const reduced = useReducedMotion();
  useLayoutEffect(() => {
    const el = ref.current; if (!el || reduced) return;
    const original = el.innerHTML; const text = el.textContent ?? ''; let context: gsap.Context | undefined;
    const existingWords = Array.from(el.querySelectorAll<HTMLSpanElement>(':scope > .statement-word'));
    const split = () => {
      context?.revert(); el.replaceChildren();
      const words = existingWords.length ? existingWords : text.split(/\s+/).filter(Boolean).map((word) => { const span = document.createElement('span'); span.textContent = word + ' '; return span; });
      words.forEach((span) => { span.style.display = 'inline-block'; span.style.whiteSpace = 'pre'; el.append(span); });
      const lines = new Map<number, HTMLSpanElement[]>();
      for (const word of words) { const top = word.offsetTop; lines.set(top, [...(lines.get(top) ?? []), word]); }
      el.replaceChildren();
      for (const line of lines.values()) { const mask = document.createElement('span'); mask.className = 'text-line-mask'; const inner = document.createElement('span'); inner.className = 'text-line'; line.forEach((word) => inner.append(word)); mask.append(inner); el.append(mask); }
      for (const line of el.children) line.setAttribute('aria-hidden', 'true'); const accessible = document.createElement('span'); accessible.className = 'sr-only'; accessible.textContent = text; el.append(accessible);
      context = gsap.context(() => gsap.fromTo('.text-line', { y: 40, clipPath: 'inset(100% 0 0 0)' }, { y: 0, clipPath: 'inset(0% 0 0 0)', duration: 0.8, stagger: 0.09, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 95%', once: true } }), el);
    };
    let live = true; document.fonts.ready.then(() => { if (live) split(); });
    let width = el.offsetWidth; const observer = new ResizeObserver(() => { if (width !== el.offsetWidth) { width = el.offsetWidth; split(); ScrollTrigger.refresh(); } }); observer.observe(el);
    return () => { live = false; observer.disconnect(); context?.revert(); el.innerHTML = original; };
  }, [reduced]);
  return ref;
}

