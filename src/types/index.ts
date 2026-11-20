export type SkillCategory = 'frontend' | 'backend' | 'tools';
export interface Skill { name: string; category: SkillCategory; proficiency: number; color: string }
export interface Project { id: number; slug: string; title: string; category: string; year: number; description: string; thumbnail: string; accentColor: string; tech: string[]; liveUrl: string; repoUrl: string }
export interface Testimonial { id: number; quote: string; name: string; role: string; company: string; avatar: string }
export interface ContactInput { name: string; email: string; subject: string; budget: string; message: string }
export interface ContactResponse { message: string; id: number; mode: 'live' | 'demo' }
