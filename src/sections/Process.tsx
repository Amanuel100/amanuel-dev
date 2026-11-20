import { useLayoutEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTextReveal } from '@/hooks/useTextReveal';
import SectionHeading from '@/components/SectionHeading';
const steps = [
  ['Discover', 'Great work starts with the right questions. We uncover your goals, your audience, and the opportunity that connects them.'],
  ['Design', 'Ideas become a visual language. Wireframes, prototypes, and motion studies bring a shared direction into focus.'],
  ['Develop', 'Clean architecture meets expressive interaction. I build a responsive, accessible experience with performance at its core.'],
  ['Test', 'Every detail gets attention. Real devices, keyboard navigation, reduced motion, and the moments between the screens.'],
  ['Launch', 'A considered handoff, a confident launch. Documentation and practical support keep the experience moving forward.']
];
function StepTitle({ children }: { children: string }) { const ref = useTextReveal<HTMLHeadingElement>(); return <h3 ref={ref}>{children}</h3>; }
export default function Process() {
  const root = useRef<HTMLElement>(null); const path = useRef<SVGPathElement>(null); const dot = useRef<SVGCircleElement>(null); const reduced = useReducedMotion();
  useLayoutEffect(() => {
    if (reduced || !path.current) return; const line = path.current; const length = line.getTotalLength();
    const context = gsap.context(() => {
      const value = { progress: 0 }; gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(value, { progress: 1, ease: 'none', scrollTrigger: { trigger: '.process-timeline', start: 'top 70%', end: 'bottom 70%', scrub: 0.5 }, onUpdate: () => { line.style.strokeDashoffset = String(length * (1 - value.progress)); const point = line.getPointAtLength(length * value.progress); dot.current?.setAttribute('cx', String(point.x)); dot.current?.setAttribute('cy', String(point.y)); } });
      gsap.utils.toArray<HTMLElement>('.process-step').forEach((step) => { gsap.from(step.querySelector('.process-card'), { rotateY: 90, opacity: 0, transformPerspective: 800, duration: 0.8, scrollTrigger: { trigger: step, start: 'top 80%', once: true } }); gsap.to(step.querySelector('.process-orb'), { scale: 1.5, boxShadow: '0 0 28px #7c3aed', repeat: 1, yoyo: true, scrollTrigger: { trigger: step, start: 'top 60%', once: true } }); });
    }, root); return () => context.revert();
  }, [reduced]);
  return <section className="process-section container section-pad" id="process" ref={root} aria-labelledby="process-title"><SectionHeading number="04" label="FROM FIRST SPARK TO FINAL PIXEL" /><h2 id="process-title">A process with<br /><em>purpose.</em></h2><div className="process-timeline"><svg className="process-path" viewBox="0 0 200 1500" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="pathGradient" x2="0" y2="1"><stop stopColor="#7c3aed" /><stop offset="1" stopColor="#22d3ee" /></linearGradient></defs><path d="M100 0C10 140 190 180 100 300S10 480 100 600S190 780 100 900S10 1080 100 1200S190 1380 100 1500" fill="none" stroke="#1e2030" /><path ref={path} d="M100 0C10 140 190 180 100 300S10 480 100 600S190 780 100 900S10 1080 100 1200S190 1380 100 1500" fill="none" stroke="url(#pathGradient)" strokeWidth="2" /><circle ref={dot} cx="100" cy="0" r="5" fill="#22d3ee" /></svg>{steps.map(([title, description], index) => <article className="process-step" key={title}><span className="process-orb" aria-hidden="true" /><div className="process-card"><span className="mono muted">0{index + 1} /</span><StepTitle>{title}</StepTitle><p className="muted">{description}</p></div></article>)}</div></section>;
}
