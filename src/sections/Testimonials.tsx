import { useEffect, useRef, useState } from 'react';
import { useDrag } from '@use-gesture/react';
import { motion } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import { testimonials as fallback } from '@/data/testimonials';
import { api } from '@/lib/api';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useInView } from '@/hooks/useInView';
import { useTextReveal } from '@/hooks/useTextReveal';
import SectionHeading from '@/components/SectionHeading';
function Quote({ text }: { text: string }) { const ref = useTextReveal<HTMLParagraphElement>(); return <p ref={ref} className="testimonial-quote">“{text}”</p>; }
export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(fallback); const [active, setActive] = useState(0); const angle = useRef(0); const dragging = useRef(false); const paused = useRef(false);
  const cylinder = useRef<HTMLDivElement>(null); const mobileTrack = useRef<HTMLDivElement>(null); const { ref, inView } = useInView<HTMLElement>(); const reduced = useReducedMotion(); const mobile = useMediaQuery('(max-width: 767px)');
  useEffect(() => { const controller = new AbortController(); api.testimonials(controller.signal).then((data) => { if (Array.isArray(data) && data.length === 5) setTestimonials(data); }).catch(() => {}); return () => controller.abort(); }, []);
  const update = (rotation: number) => { angle.current = rotation; if (cylinder.current) cylinder.current.style.transform = `rotateY(${rotation}deg)`; setActive(((Math.round(-rotation / 72) % 5) + 5) % 5); };
  const goTo = (index: number) => {
    const next = (index + 5) % 5;
    if (mobile) { mobileTrack.current?.children[next]?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'nearest', inline: 'center' }); setActive(next); return; }
    const current = angle.current; let target = -next * 72; target += Math.round((current - target) / 360) * 360;
    gsap.to(angle, { current: target, duration: reduced ? 0 : 0.65, ease: 'power3.out', onUpdate: () => update(angle.current) });
  };
  const bind = useDrag(({ first, last, movement: [mx], memo }) => {
    if (mobile) return memo; if (first) { gsap.killTweensOf(angle); dragging.current = true; memo = angle.current; }
    const start = typeof memo === 'number' ? memo : 0; update(start + mx * 0.22);
    if (last) { dragging.current = false; goTo(Math.round(-angle.current / 72)); } return start;
  }, { axis: 'x', filterTaps: true });
  useEffect(() => {
    if (reduced || mobile || !inView) return;
    const drift = () => { if (!dragging.current && !paused.current && !gsap.isTweening(angle)) update(angle.current + 0.05 * gsap.ticker.deltaRatio(60)); };
    gsap.ticker.add(drift); return () => { gsap.ticker.remove(drift); gsap.killTweensOf(angle); };
  }, [reduced, mobile, inView]);
  return <section className="testimonials-section section-pad" ref={ref} aria-labelledby="testimonials-title"><div className="container"><SectionHeading number="05" label="KIND WORDS" /><h2 id="testimonials-title">Good work.<br /><em>Great connections.</em></h2><p className="demo-note">Sample testimonials · fictional names and companies for this portfolio concept.</p></div><div className="carousel-stage" {...bind()} data-cursor="drag" role="region" aria-roledescription="carousel" aria-label="Client testimonial examples" tabIndex={0} onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); goTo(active + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(active - 1); } }} onFocus={() => { paused.current = true; }} onBlur={() => { paused.current = false; }} onPointerEnter={() => { paused.current = true; }} onPointerLeave={() => { paused.current = false; }}>
    <div className={mobile ? 'carousel-mobile' : 'carousel-cylinder'} ref={mobile ? mobileTrack : cylinder} onScroll={mobile ? (e) => { const track = e.currentTarget; setActive(Math.round(track.scrollLeft / Math.max(1, (track.firstElementChild as HTMLElement | null)?.offsetWidth ?? 1))); } : undefined}>{testimonials.map((item, i) => <article className={`testimonial-card ${active === i ? 'active' : ''}`} key={item.id} aria-hidden={!mobile && active !== i} style={mobile ? undefined : { transform: `rotateY(${i * 72}deg) translateZ(420px) scale(${active === i ? 1 : 0.9})` }}><span className="quote-mark" aria-hidden="true">“</span><Quote text={item.quote} /><div className="testimonial-person"><img src={item.avatar} width="48" height="48" alt="" loading="lazy" /><div><strong>{item.name}</strong><p>{item.role} @ {item.company}</p></div></div></article>)}</div>
    </div><div className="carousel-controls"><div className="stars" aria-label="Example five-star rating">{[0, 1, 2, 3, 4].map((i) => <motion.span key={i} initial={{ scale: reduced ? 1 : 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: reduced ? 0 : i * 0.1 }}>★</motion.span>)}</div><div className="carousel-dots">{testimonials.map((item, i) => <button key={item.id} onClick={() => goTo(i)} aria-label={`Show testimonial ${i + 1} from ${item.name}`} aria-pressed={active === i} />)}</div><p className="mono muted">DRAG TO EXPLORE · ARROW KEYS TO NAVIGATE</p></div></section>;
}
