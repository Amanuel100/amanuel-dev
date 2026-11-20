import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Hero from '@/sections/Hero';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Cursor from '@/components/Cursor';
import Preloader from '@/components/Preloader';
import CanvasRoot from '@/components/CanvasRoot';
import NoiseOverlay from '@/components/NoiseOverlay';
import Vignette from '@/components/Vignette';
import ScrollProgress from '@/components/ScrollProgress';
import RouteTransition from '@/components/RouteTransition';
import SEO from '@/components/SEO';
import Divider from '@/components/Divider';
import DeferredSection from '@/components/DeferredSection';
import Button from '@/components/Button';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useAppStore } from '@/store/useAppStore';
import { ScrollTrigger } from '@/lib/gsap';
const About = lazy(() => import('@/sections/About'));
const Skills = lazy(() => import('@/sections/Skills'));
const Projects = lazy(() => import('@/sections/Projects'));
const Process = lazy(() => import('@/sections/Process'));
const Contact = lazy(() => import('@/sections/Contact'));
const CaseStudy = lazy(() => import('@/sections/CaseStudy'));
function Sections({ children }: { children: React.ReactNode }) { return <Suspense fallback={<div className="section-loading" role="status">Preparing the next chapter…</div>}>{children}</Suspense>; }
function Home() { return <><SEO /><Hero /><DeferredSection id="about"><Divider /><About /></DeferredSection><DeferredSection id="skills"><Divider /><Skills /></DeferredSection><DeferredSection id="work"><Divider /><Projects /></DeferredSection><DeferredSection id="process"><Divider /><Process /></DeferredSection><DeferredSection id="contact"><Divider /><Contact /></DeferredSection></>; }
function RouteHeading({ title, label }: { title: string; label: string }) { return <div className="container route-heading"><p className="eyebrow">{label}</p><h1>{title}<span className="text-accent">.</span></h1></div>; }
export default function App() {
  useMousePosition(); const [showLoader, setShowLoader] = useState(() => { try { return sessionStorage.getItem('ae-loaded') !== '1'; } catch { return true; } }); const { pathname } = useLocation();
  const complete = useCallback(() => { try { sessionStorage.setItem('ae-loaded', '1'); } catch { /* Private browsing may disable storage. */ } setShowLoader(false); useAppStore.getState().setLoaded(true); ScrollTrigger.refresh(); }, []);
  useEffect(() => { if (!showLoader) useAppStore.getState().setLoaded(true); }, [showLoader]);
  useEffect(() => { const timer = window.setTimeout(() => ScrollTrigger.refresh(), 500); return () => clearTimeout(timer); }, [pathname]);
  return <><a className="skip-link" href="#main">Skip to content</a><Nav /><main id="main" tabIndex={-1}><Routes><Route path="/" element={<Home />} /><Route path="/work" element={<><SEO title="Selected Work" /><RouteHeading title="Selected work" label="DIGITAL EXPERIENCES / 2024—2026" /><Sections><Projects /><Contact /></Sections></>} /><Route path="/work/:slug" element={<Sections><CaseStudy /></Sections>} /><Route path="/about" element={<><SEO title="About & Process" /><RouteHeading title="Curiosity, in motion" label="DEVELOPER / DESIGN THINKER / COLLABORATOR" /><Sections><About /><Skills /><Process /></Sections></>} /><Route path="/contact" element={<><SEO title="Contact" /><div className="contact-route"><Sections><Contact /></Sections></div></>} /><Route path="*" element={<section className="container route-heading"><SEO title="Page not found" /><h1>A small detour.</h1><p>This page doesn’t exist. Let’s get you home.</p><Button to="/">Back home ↗</Button></section>} /></Routes></main><Footer /><CanvasRoot /><Cursor /><ScrollProgress /><NoiseOverlay /><Vignette /><RouteTransition />{showLoader && <Preloader onComplete={complete} />}</>;
}


