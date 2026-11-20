import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { projects as fallback } from '@/data/projects';
import type { Project } from '@/types';
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(fallback); const [source, setSource] = useState<'local' | 'api'>('local');
  useEffect(() => { const controller = new AbortController(); api.projects(controller.signal).then((data) => { if (Array.isArray(data) && data.length > 0) { setProjects(data); setSource('api'); } }).catch(() => { /* Curated local projects keep the portfolio available offline. */ }); return () => controller.abort(); }, []);
  return { projects, source };
}
