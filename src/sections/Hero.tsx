import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useAppStore } from '@/store/useAppStore';
import { useSplitText } from '@/hooks/useSplitText';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import Button from '@/components/Button';
import Magnetic from '@/components/Magnetic';
function Name({ text }: { text: string }) { const chars = useSplitText(text); return <span className="hero-name-line" aria-hidden="true">{chars.map((char, i) => <span className="hero-char" key={i}>{char}</span>)}</span>; }
export default function Hero() {
  const root = useRef<HTMLElement>(null); const loaded = useAppStore((s) => s.loaded); const reduced = useReducedMotion(); const mobile = useMediaQuery('(max-width: 767px)');
  const [time, setTime] = useState('');
  useEffect(() => { const update = () => setTime(new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Addis_Ababa', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())); update(); const timer = window.setInterval(update, 1000); return () => clearInterval(timer); }, []);
  useLayoutEffect(() => {
    if (!loaded || reduced) return;
    const context = gsap.context(() => {
      gsap.timeline().from('.hero-name-line:first-child .hero-char', { y: 120, rotateX: -90, opacity: 0, stagger: 0.03, ease: 'power4.out', duration: 0.9 })
        .from('.hero-name-line:nth-child(2) .hero-char', { y: 120, rotateX: -90, opacity: 0, stagger: 0.03, ease: 'power4.out', duration: 0.9 }, 0.15)
        .from('.hero-description', { y: 20, opacity: 0 }, 0.4).from('.hero-actions .magnetic', { y: 20, opacity: 0, stagger: 0.12 }, 0.6).from('.hero-side, .hero-meta, .hero-eyebrow', { opacity: 0 }, 0.8);
      const timeline = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=100%', pin: !mobile, scrub: 1, invalidateOnRefresh: true, onUpdate: (self) => useAppStore.getState().setCameraDolly(self.progress) } });
      timeline.to('.hero-title', { y: -80, filter: 'blur(16px)', opacity: 0, ease: 'none' }, 0).to('.scroll-indicator', { opacity: 0, duration: 0.1 }, 0);
    }, root); ScrollTrigger.refresh(); return () => { context.revert(); useAppStore.getState().setCameraDolly(0); };
  }, [loaded, reduced, mobile]);
  return <section className="hero container" id="hero" ref={root} aria-labelledby="hero-title">
    <div className="hero-orbit-label" aria-hidden="true"><span className="crosshair">+</span> EXPERIMENT 001 — DIGITAL MATTER</div>
    <div className="hero-copy"><p className="eyebrow hero-eyebrow"><span className="status-dot" /> Creative Web Developer — Available for work</p>
      <h1 id="hero-title" className="hero-title" aria-label="Amanuel Eyob"><Name text="AMANUEL" /><Name text="EYOB" /><span className="title-period" aria-hidden="true">.</span></h1>
      <div className="hero-under"><p className="hero-description">I build immersive, high-performance web experiences with React, Three.js, and a lot of love for motion.</p>
        <div className="hero-actions"><Magnetic><Button to="/work">View Work <span>↗</span></Button></Magnetic><Magnetic><Button to="/contact" variant="secondary">Get in Touch <span>↗</span></Button></Magnetic></div></div>
    </div>
    <aside className="hero-side"><span className="mono muted">BASED IN</span><p>Addis Ababa, ET<br /><span className="muted">{time} EAT</span></p><div className="social-mini"><a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GH ↗ GitHub platform">GH ↗</a><a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="IN ↗ LinkedIn platform">IN ↗</a></div></aside>
    <div className="hero-meta"><span className="mono muted">INDEPENDENT DEVELOPER & CREATIVE THINKER</span><a className="scroll-indicator" href="#about" aria-label="Scroll to explore about Amanuel"><span className="mouse-outline"><i /></span><span>SCROLL TO EXPLORE</span></a><span className="availability"><span className="status-dot" /> Open for collaborations</span></div>
  </section>;
}


