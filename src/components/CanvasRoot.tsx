import { Component, lazy, Suspense, useEffect, useState, type PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
const Experience = lazy(() => import('@/three/Experience'));
export class CanvasBoundary extends Component<PropsWithChildren, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }

  render() { return this.state.failed ? <div className="canvas-fallback" aria-hidden="true" /> : this.props.children; }
}
export default function CanvasRoot() {
  const { pathname } = useLocation(); const [visible, setVisible] = useState(pathname === '/');
  useEffect(() => {
    const hero = document.getElementById('hero'); if (!hero) { setVisible(false); return; }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '200px' }); observer.observe(hero); return () => observer.disconnect();
  }, [pathname]);
  return <><div className="experience fixed inset-0 -z-10 pointer-events-none" aria-hidden="true"><CanvasBoundary><Suspense fallback={null}>{visible && <Experience />}</Suspense></CanvasBoundary></div><span className="sr-only">An iridescent violet and cyan sculpture floats among drifting stars.</span></>;
}

