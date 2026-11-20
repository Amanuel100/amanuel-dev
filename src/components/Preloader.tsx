import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useSmoothScroll } from './SmoothScrollProvider';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const { progress, active, total } = useProgress();
  const { stop, start } = useSmoothScroll();
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [displayPercent, setDisplayPercent] = useState(0);
  const completed = useRef(false);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    stop();
    return () => {
      document.body.style.overflow = previous;
      start();
    };
  }, [stop, start]);

  useEffect(() => {
    let live = true;
    document.fonts.ready.then(() => {
      if (live) setReady(true);
    });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    const target = ready && !active && (total === 0 || progress === 100) ? 100 : Math.round(progress);
    if (reduced) {
      setDisplayPercent(target);
      return;
    }
    const interval = window.setInterval(() => {
      setDisplayPercent((current) => {
        if (current >= target) {
          clearInterval(interval);
          return target;
        }
        const delta = Math.max(1, Math.ceil((target - current) * 0.2));
        return Math.min(target, current + delta);
      });
    }, 24);
    return () => clearInterval(interval);
  }, [ready, active, total, progress, reduced]);

  useEffect(() => {
    if (!ready || displayPercent < 100) return;
    const timer = window.setTimeout(() => setLeaving(true), reduced ? 0 : 500);
    return () => clearTimeout(timer);
  }, [ready, displayPercent, reduced]);

  const finish = () => {
    if (completed.current) return;
    completed.current = true;
    start();
    onComplete();
  };

  const statusLabel =
    displayPercent < 40
      ? 'INITIALIZING CANVAS'
      : displayPercent < 80
      ? 'LOADING DIGITAL ASSETS'
      : displayPercent < 100
      ? 'PREPARING EXPERIENCE'
      : 'WELCOME';

  return (
    <div className="preloader" role="status" aria-label="Loading portfolio">
      <motion.div
        className="preloader-half top"
        animate={{ y: leaving ? '-100%' : '0%' }}
        transition={{ duration: reduced ? 0 : 1.1, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="preloader-half bottom"
        animate={{ y: leaving ? '100%' : '0%' }}
        transition={{ duration: reduced ? 0 : 1.1, ease: [0.76, 0, 0.24, 1] }}
        onAnimationComplete={() => {
          if (leaving) finish();
        }}
      />
      <motion.div
        className="preloader-center"
        animate={{ scale: leaving ? 0.9 : 1, opacity: leaving ? 0 : 1 }}
        transition={{ duration: reduced ? 0 : 0.4 }}
      >
        <div className="preloader-halo" aria-hidden="true" />
        <div className="preloader-brand">
          <svg width="84" height="64" viewBox="0 0 120 80" fill="none" aria-hidden="true">
            <motion.path
              d="M8 68L32 12L56 68M18 46H46M108 12H70V68H108M70 40H100"
              stroke="url(#preloader-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: reduced ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="preloader-gradient" x1="0" y1="0" x2="120" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a78bfa" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="preloader-titles">
          <h2>AMANUEL EYOB</h2>
          <span className="preloader-sub">{statusLabel}</span>
        </div>
        <div className="preloader-bar-wrap">
          <div className="preloader-bar" style={{ width: `${displayPercent}%` }} />
        </div>
        <span className="preloader-counter mono">{displayPercent.toString().padStart(3, '0')}%</span>
      </motion.div>
    </div>
  );
}
