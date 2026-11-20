import { Suspense, useEffect, type PropsWithChildren } from 'react';
import { useInView } from '@/hooks/useInView';
import { ScrollTrigger } from '@/lib/gsap';
export default function DeferredSection({ children, id }: PropsWithChildren<{ id?: string }>) {
  const { ref, inView } = useInView(true);
  useEffect(() => { if (!inView) return; const timer = window.setTimeout(() => ScrollTrigger.refresh(), 200); return () => clearTimeout(timer); }, [inView]);
  return <div ref={ref} id={id} style={{ minHeight: inView ? undefined : '100svh' }}>{inView && <Suspense fallback={<div className="section-loading" role="status">Preparing the next chapter…</div>}>{children}</Suspense>}</div>;
}
