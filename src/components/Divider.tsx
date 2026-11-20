import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
export default function Divider() { const reduced = useReducedMotion(); return <motion.div className="section-divider" initial={{ scaleX: reduced ? 1 : 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: reduced ? 0 : 1.1 }} aria-hidden="true" />; }
