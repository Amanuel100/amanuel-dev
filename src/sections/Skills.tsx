import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useAppStore } from '@/store/useAppStore';
import { skills } from '@/data/skills';
import type { SkillCategory } from '@/types';
import SkillsScene from '@/three/scenes/SkillsScene';
import SectionHeading from '@/components/SectionHeading';
import { CanvasBoundary } from '@/components/CanvasRoot';
export default function Skills() {
  const { ref, inView } = useInView<HTMLElement>(); const reduced = useReducedMotion(); const mobile = useMediaQuery('(max-width: 767px)');
  const skillFilter = useAppStore((s) => s.skillFilter);
  const setSkillFilter = useAppStore((s) => s.setSkillFilter);
  const selectedSkill = useAppStore((s) => s.selectedSkill);
  const setSelectedSkill = useAppStore((s) => s.setSelectedSkill);
  const [dpr, setDpr] = useState(1.5);
  return <section className="skills-section section-pad container" id="skills" ref={ref} aria-labelledby="skills-title"><div className="section-top"><div><SectionHeading number="02" label="MY CREATIVE TOOLKIT" /><h2 id="skills-title">Skills & <em>Stack.</em></h2><p className="muted max-copy">The right tool for every idea.<br />A connected universe of design and development.</p></div><div className="filter-tabs" role="group" aria-label="Filter skills">{(['all', 'frontend', 'backend', 'tools'] as const).map((tab) => <button key={tab} aria-pressed={skillFilter === tab} onClick={() => setSkillFilter(tab as SkillCategory | 'all')}>{tab}</button>)}</div></div>
    <div className="skills-visual" data-cursor="hover"><span className="orbital-label mono" aria-hidden="true">EXPLORE THE ORBIT / SELECT A SKILL</span><div className="skills-canvas" aria-hidden="true"><CanvasBoundary>{inView && <Canvas camera={{ position: [0, 0, mobile ? 16 : 13], fov: 45 }} dpr={[1, dpr]} frameloop={reduced ? 'demand' : 'always'} onPointerMissed={() => setSelectedSkill(null)}><PerformanceMonitor onDecline={() => setDpr(1)}><Suspense fallback={null}><SkillsScene mobile={mobile} reduced={reduced} /></Suspense></PerformanceMonitor></Canvas>}</CanvasBoundary></div>
      {selectedSkill && <aside className="skill-detail" aria-live="polite"><button className="detail-close" onClick={() => setSelectedSkill(null)} aria-label="Close skill details">×</button><span className="eyebrow">{selectedSkill.category}</span><h3>{selectedSkill.name}</h3><p>Working proficiency</p><div className="skill-meter"><span style={{ width: `${selectedSkill.proficiency}%`, background: selectedSkill.color }} /></div><strong>{selectedSkill.proficiency}%</strong></aside>}
    </div><div className="skills-accessible" aria-label="Explore skills">{skills.filter((s) => skillFilter === 'all' || s.category === skillFilter).map((skill) => <button key={skill.name} onClick={() => setSelectedSkill(skill)} aria-pressed={selectedSkill?.name === skill.name}><span style={{ background: skill.color }} />{skill.name}</button>)}</div><p className="demo-note">Self-assessment values are editable in the skill data.</p>
  </section>;
}

