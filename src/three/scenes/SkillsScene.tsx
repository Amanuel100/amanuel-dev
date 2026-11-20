import { useEffect, useRef } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Vector3, type Group } from 'three';
import { gsap } from '@/lib/gsap';
import { skills } from '@/data/skills';
import { useAppStore } from '@/store/useAppStore';
import type { Skill } from '@/types';
import SkillBadge from '../components/SkillBadge';
export default function SkillsScene({ mobile, reduced }: { mobile: boolean; reduced: boolean }) {
  const rings = useRef<(Group | null)[]>([]); const core = useRef<Group>(null); const { camera, invalidate } = useThree();
  const selected = useAppStore((s) => s.selectedSkill); const target = useRef(new Vector3()); const tween = useRef<gsap.core.Tween>();
  useEffect(() => { if (!selected) { target.current.set(0, 0, 0); tween.current?.kill(); tween.current = gsap.to(camera.position, { x: 0, y: 0, z: mobile ? 16 : 13, duration: reduced ? 0 : 1, onUpdate: () => { camera.lookAt(target.current); invalidate(); } }); } return () => { tween.current?.kill(); }; }, [selected, camera, mobile, reduced, invalidate]);
  const focus = (event: ThreeEvent<MouseEvent>, skill: Skill) => { target.current.copy(event.point); useAppStore.getState().setSelectedSkill(skill); tween.current?.kill(); tween.current = gsap.to(camera.position, { x: event.point.x * 0.6, y: event.point.y * 0.6, z: event.point.z + 7, duration: reduced ? 0 : 1.2, ease: 'power3.inOut', onUpdate: () => { camera.lookAt(target.current); invalidate(); } }); };
  useFrame((_, delta) => {
    if (reduced || selected) return; const speed = 1 + useAppStore.getState().scrollProgress;
    rings.current.forEach((ring, i) => { if (ring) { ring.rotation.z += delta * 0.025 * (i % 2 ? -1 : 1) * speed; ring.rotation.y = Math.sin(ring.rotation.z) * 0.25; } });
    if (core.current) { core.current.rotation.y += delta * 0.13; core.current.rotation.x += delta * 0.05; }
  });
  const groups = mobile ? [skills] : ['frontend', 'backend', 'tools'].map((category) => skills.filter((skill) => skill.category === category));
  return <><ambientLight intensity={1.5} /><pointLight position={[2, 3, 5]} intensity={20} color="#7c3aed" /><group ref={core}><mesh><icosahedronGeometry args={[0.9, 1]} /><meshStandardMaterial wireframe color="#7c3aed" emissive="#7c3aed" emissiveIntensity={1.5} /></mesh></group>{groups.map((group, ring) => <group ref={(element) => { rings.current[ring] = element; }} key={ring} rotation={[0, 0, ring * 0.22]}>{group.map((skill, index) => { const angle = index / group.length * Math.PI * 2; const radius = mobile ? 4.6 : 2.2 + ring * 1.2; return <SkillBadge key={skill.name} skill={skill} mobile={mobile} reduced={reduced} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, Math.sin(angle * 2) * 0.35]} onFocus={focus} />; })}</group>)}</>;
}
