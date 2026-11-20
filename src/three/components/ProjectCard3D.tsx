import { useMemo, useRef, type MutableRefObject } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MathUtils, type Mesh, type ShaderMaterial } from 'three';
import type { Project } from '@/types';
const vertex = `uniform float uTime;uniform float uHover;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;p.z+=sin(p.x*4.0+uTime*2.0)*cos(p.y*3.0+uTime)*uHover*0.06;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`;
const fragment = `uniform sampler2D uTexture;uniform float uOpacity;varying vec2 vUv;void main(){vec4 color=texture2D(uTexture,vUv);gl_FragColor=vec4(color.rgb,uOpacity);}`;
export default function ProjectCard3D({ project, progress, reduced }: { project: Project; progress: MutableRefObject<number>; reduced: boolean }) {
  const texture = useTexture(project.thumbnail); const mesh = useRef<Mesh>(null); const material = useRef<ShaderMaterial>(null); const hover = useRef(0);
  const uniforms = useMemo(() => ({ uTexture: { value: texture }, uTime: { value: 0 }, uHover: { value: 0 }, uOpacity: { value: 1 } }), [texture]);
  useFrame(({ clock }) => {
    if (!mesh.current || !material.current) return; const p = progress.current;
    mesh.current.position.z = reduced ? 0 : p < 0.5 ? MathUtils.lerp(-5, 0, p * 2) : MathUtils.lerp(0, 2, (p - 0.5) * 2);
    mesh.current.rotation.y = reduced ? 0 : MathUtils.degToRad(p < 0.5 ? MathUtils.lerp(-25, 0, p * 2) : MathUtils.lerp(0, 15, (p - 0.5) * 2));
    material.current.uniforms.uTime.value = reduced ? 0 : clock.elapsedTime; material.current.uniforms.uHover.value = MathUtils.lerp(material.current.uniforms.uHover.value as number, hover.current, 0.08);
    material.current.uniforms.uOpacity.value = reduced ? 1 : Math.min(1, p * 5, (1 - p) * 5);
  });
  return <mesh ref={mesh} onPointerOver={() => { hover.current = 1; }} onPointerOut={() => { hover.current = 0; }}><planeGeometry args={[5.6, 3.5, 32, 24]} /><shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment} transparent /></mesh>;
}
