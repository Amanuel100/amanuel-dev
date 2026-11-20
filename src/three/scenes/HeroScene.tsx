import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, MathUtils, type Mesh, type ShaderMaterial } from 'three';
import vertexShader from '../shaders/hero.vert.glsl';
import fragmentShader from '../shaders/hero.frag.glsl';
import particleVertex from '../shaders/particles.vert.glsl';
import particleFragment from '../shaders/particles.frag.glsl';
import { useAppStore } from '@/store/useAppStore';
export default function HeroScene({ mobile, reduced }: { mobile: boolean; reduced: boolean }) {
  const mesh = useRef<Mesh>(null); const material = useRef<ShaderMaterial>(null); const particles = useRef<ShaderMaterial>(null);
  const { gl, camera } = useThree(); const count = mobile ? 800 : 3000;
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uNoiseStrength: { value: 0.15 } }), []);
  const particleUniforms = useMemo(() => ({ uTime: { value: 0 }, uPixelRatio: { value: gl.getPixelRatio() } }), [gl]);
  const [positions, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3); const sizes = new Float32Array(count); let seed = 73;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < count; i++) { const theta = random() * Math.PI * 2; const phi = Math.acos(2 * random() - 1); const r = Math.cbrt(random()) * 6; positions.set([r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi) - 3], i * 3); sizes[i] = random() * 1.4 + 0.4; }
    return [positions, sizes];
  }, [count]);
  useFrame(({ clock }) => {
    if (!mesh.current || !material.current || !particles.current) return;
    const { mouse, scrollProgress, cameraDolly } = useAppStore.getState();
    if (!reduced) {
      material.current.uniforms.uTime.value = clock.elapsedTime; particles.current.uniforms.uTime.value = clock.elapsedTime;
      mesh.current.rotation.x = MathUtils.lerp(mesh.current.rotation.x, mouse.y * 0.3, 0.05);
      mesh.current.rotation.y = MathUtils.lerp(mesh.current.rotation.y, mouse.x * 0.3 + clock.elapsedTime * 0.04, 0.05);
      mesh.current.position.y = 0.05 - scrollProgress * 3; mesh.current.scale.setScalar((mobile ? 0.8 : 1) * (1 - scrollProgress * 0.2));
      camera.position.z = 6 - cameraDolly * 1.2;
    }
  });
  return <group position={[mobile ? 0.4 : 1.35, mobile ? 0.8 : 0.05, 0]}>
    <mesh ref={mesh} rotation={[0.2, 0.1, -0.2]}><icosahedronGeometry args={[1.4, mobile ? 16 : 64]} /><shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} /></mesh>
    <points frustumCulled={false}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /><bufferAttribute attach="attributes-aSize" args={[sizes, 1]} /></bufferGeometry><shaderMaterial ref={particles} uniforms={particleUniforms} vertexShader={particleVertex} fragmentShader={particleFragment} transparent blending={AdditiveBlending} depthWrite={false} /></points>
  </group>;
}

