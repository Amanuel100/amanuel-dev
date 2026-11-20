import { Suspense, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { gsap } from '@/lib/gsap';
import { AdaptiveDpr, Environment, PerformanceMonitor } from '@react-three/drei';
import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { Vector2 } from 'three';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import HeroScene from './scenes/HeroScene';
function FrameDriver({ mobile, reduced }: { mobile: boolean; reduced: boolean }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    if (reduced) return;
    let last = 0;
    const render = (time: number) => { if (!document.hidden && time - last >= 0.9 / (mobile ? 30 : 60)) { last = time; invalidate(); } };
    gsap.ticker.add(render); return () => gsap.ticker.remove(render);
  }, [mobile, reduced, invalidate]);
  return null;
}
const offset = new Vector2(0.0008, 0.0008);
export default function Experience() {
  const mobile = useMediaQuery('(max-width: 767px)'); const reduced = useReducedMotion(); const [dpr, setDpr] = useState(1);
  return <Canvas dpr={[1, dpr]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} camera={{ position: [0, 0, 6], fov: 45 }} frameloop="demand">
    <FrameDriver mobile={mobile} reduced={reduced} />
    <PerformanceMonitor bounds={() => [35, 55]} flipflops={3} onDecline={() => setDpr(1)} onIncline={() => setDpr(mobile ? 1 : 2)} onFallback={() => setDpr(1)}><AdaptiveDpr pixelated /><HeroScene mobile={mobile} reduced={reduced} /></PerformanceMonitor>
    {!mobile && dpr > 1 && <Suspense fallback={null}><Environment preset="city" environmentIntensity={0.3} /></Suspense>}
    {!mobile && !reduced && dpr > 1 && <EffectComposer multisampling={0}><Bloom intensity={0.6} luminanceThreshold={0.6} mipmapBlur /><ChromaticAberration offset={offset} radialModulation={false} modulationOffset={0} /><Vignette darkness={0.6} /><Noise opacity={0.03} /></EffectComposer>}
  </Canvas>;
}


