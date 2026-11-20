import { useRef, type PropsWithChildren } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
export default function Magnetic({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null); const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18 }); const sy = useSpring(y, { stiffness: 180, damping: 18 });
  const reduced = useReducedMotion(); const touch = useMediaQuery('(hover: none)');
  return <motion.div ref={ref} className="magnetic" style={{ x: sx, y: sy }} onPointerMove={(e) => {
    if (reduced || touch || !ref.current) return; const box = ref.current.getBoundingClientRect();
    const dx = e.clientX - box.left - box.width / 2; const dy = e.clientY - box.top - box.height / 2;
    if (Math.hypot(dx, dy) < 80) { x.set(dx * 0.2); y.set(dy * 0.2); }
  }} onPointerLeave={() => { x.set(0); y.set(0); }}>{children}</motion.div>;
}
