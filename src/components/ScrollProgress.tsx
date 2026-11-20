import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useAppStore } from '@/store/useAppStore';
export default function ScrollProgress() {
  const { progress } = useScrollProgress();
  useEffect(() => progress.on('change', useAppStore.getState().setScrollProgress), [progress]);
  return <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />;
}
