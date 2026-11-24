import { Suspense, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useProjects } from '@/hooks/useProjects';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { Project } from '@/types';
import SectionHeading from '@/components/SectionHeading';
import RevealImage from '@/components/RevealImage';
import ProjectCard3D from '@/three/components/ProjectCard3D';
import { CanvasBoundary } from '@/components/CanvasRoot';
function ProjectStage({ project, index, count }: { project: Project; index: number; count: number }) {
  const { ref, inView } = useInView<HTMLElement>(); const progress = useRef(0.5); const reduced = useReducedMotion(); const mobile = useMediaQuery('(max-width: 767px)');
  useLayoutEffect(() => {
    if (reduced || mobile) return;
    const context = gsap.context(() => {
      ScrollTrigger.create({ trigger: ref.current, start: 'top top', end: '+=100%', pin: true, scrub: 1, onUpdate: (self) => { progress.current = self.progress; } });
      gsap.fromTo('.project-color-field', { backgroundColor: '#05060a' }, { backgroundColor: project.accentColor, scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'top top', scrub: true } });
    }, ref); ScrollTrigger.refresh(); return () => context.revert();
  }, [project.accentColor, reduced, mobile, ref]);
  return <article className="project-stage" ref={ref} aria-labelledby={`project-${project.id}`}><div className="project-color-field" style={{ backgroundColor: project.accentColor }} aria-hidden="true" /><div className="project-index mono">{String(index + 1).padStart(2, '0')} <span>/ {String(count).padStart(2, '0')}</span><span className="project-kind">FEATURED WORK</span></div>
    {mobile || reduced ? <RevealImage src={project.thumbnail} alt={`${project.title} interface showcase`} className="project-mobile-image" /> : <div className="project-canvas" aria-hidden="true" data-cursor="view"><CanvasBoundary>{inView && <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]}><Suspense fallback={null}><ProjectCard3D project={project} progress={progress} reduced={reduced} /></Suspense></Canvas>}</CanvasBoundary></div>}
    <div className="project-info"><div><p className="eyebrow">{project.category} <span>•</span> {project.year}</p><h3 id={`project-${project.id}`}>{project.title}</h3><div style={{ display: 'flex', gap: '18px', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap' }}><Link className="text-link" data-cursor="view" to={`/work/${project.slug}`}>Case Study <span>↗</span></Link>{project.liveUrl && project.liveUrl.startsWith('http') && <a className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer" data-cursor="hover">Live Website <span>↗</span></a>}{project.repoUrl && <a className="text-link" href={project.repoUrl} target="_blank" rel="noreferrer" data-cursor="hover">GitHub <span>↗</span></a>}</div></div><div className="tech-tags">{project.tech.map((tech) => <span key={tech}>{tech}</span>)}</div></div>
  </article>;
}
export default function Projects() {
  const { projects } = useProjects();
  return <section id="work" className="projects-section" aria-label="Selected projects"><div className="container section-pad projects-heading"><SectionHeading number="03" label="SELECTED WORK" /><h2>Ideas made<br /><em>interactive.</em><span className="heading-star">✳</span></h2><p className="muted">Six featured projects. Real-world platforms, generative AI, and interactive replicas.</p></div>{projects.map((project, index) => <ProjectStage key={project.id} project={project} index={index} count={projects.length} />)}<div className="work-marquee" aria-hidden="true">{[0, 1, 2].map((row) => <div className="marquee-track" key={row}><span>MORE WORK ↗ MORE WORK ↗ MORE WORK ↗ </span><span>MORE WORK ↗ MORE WORK ↗ MORE WORK ↗ </span></div>)}</div></section>;
}
