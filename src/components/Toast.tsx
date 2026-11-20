import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
export interface ToastMessage { kind: 'success' | 'error'; text: string }
export default function Toast({ message, onClose }: { message: ToastMessage | null; onClose: () => void }) {
  useEffect(() => { if (!message) return; const timer = window.setTimeout(onClose, 8000); return () => clearTimeout(timer); }, [message, onClose]);
  return <div className="toast-container" aria-live="polite" aria-atomic="true"><AnimatePresence>{message && <motion.div className={`toast ${message.kind}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}><span>{message.kind === 'success' ? '✓' : '!'}</span><p>{message.text}</p><button onClick={onClose} aria-label="Dismiss notification">×</button></motion.div>}</AnimatePresence></div>;
}
