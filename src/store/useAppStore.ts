import { create } from 'zustand';
import type { Skill, SkillCategory } from '@/types';
interface AppState {
  loaded: boolean; setLoaded: (loaded: boolean) => void;
  scrollProgress: number; mouse: { x: number; y: number }; cameraDolly: number;
  setScrollProgress: (value: number) => void; setMouse: (mouse: { x: number; y: number }) => void;
  setCameraDolly: (value: number) => void;
  skillFilter: SkillCategory | 'all'; setSkillFilter: (filter: SkillCategory | 'all') => void;
  selectedSkill: Skill | null; setSelectedSkill: (skill: Skill | null) => void;
}
export const useAppStore = create<AppState>((set) => ({
  loaded: false, setLoaded: (loaded) => set({ loaded }),
  scrollProgress: 0, mouse: { x: 0, y: 0 }, cameraDolly: 0,
  setScrollProgress: (scrollProgress) => set({ scrollProgress }), setMouse: (mouse) => set({ mouse }),
  setCameraDolly: (cameraDolly) => set({ cameraDolly }),
  skillFilter: 'all', setSkillFilter: (skillFilter) => set({ skillFilter }),
  selectedSkill: null, setSelectedSkill: (selectedSkill) => set({ selectedSkill })
}));
