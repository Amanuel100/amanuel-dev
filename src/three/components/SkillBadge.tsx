import { useRef, useState } from 'react';
import { Billboard, RoundedBox, Text } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { MathUtils, type Group, type MeshPhysicalMaterial } from 'three';
import type { Skill } from '@/types';
import { useAppStore } from '@/store/useAppStore';
export default function SkillBadge({ skill, position, mobile, reduced, onFocus }: { skill: Skill; position: [number, number, number]; mobile: boolean; reduced: boolean; onFocus: (event: ThreeEvent<MouseEvent>, skill: Skill) => void }) {
  const group = useRef<Group>(null); const material = useRef<MeshPhysicalMaterial>(null); const [hover, setHover] = useState(false);
  const filter = useAppStore((s) => s.skillFilter); const selected = filter === 'all' || filter === skill.category;
  useFrame(() => { if (group.current) group.current.scale.setScalar(MathUtils.lerp(group.current.scale.x, hover ? 1.15 : 1, reduced ? 1 : 0.15)); if (material.current) material.current.opacity = MathUtils.lerp(material.current.opacity, selected ? 1 : 0.15, 0.12); });
  return <Billboard position={position}><group ref={group} onPointerOver={(e) => { e.stopPropagation(); setHover(true); }} onPointerOut={() => setHover(false)} onClick={(e) => { e.stopPropagation(); if (!mobile) onFocus(e, skill); }}>
    <RoundedBox args={[mobile ? 1.65 : 1.45, 0.52, 0.12]} radius={0.12} smoothness={3}><meshPhysicalMaterial ref={material} color="#171322" transmission={0.9} roughness={0.1} thickness={0.4} transparent emissive={skill.color} emissiveIntensity={hover ? 0.45 : 0.12} /></RoundedBox>
    <Text position={[0, 0, 0.09]} fontSize={0.18} color={selected ? '#ffffff' : '#51515d'} anchorX="center" anchorY="middle">{skill.name}</Text>
  </group></Billboard>;
}
