import { Router } from 'express';
import type { RowDataPacket } from 'mysql2';
import { z } from 'zod';
import { pool } from '../db/pool';
import { env } from '../config';
import { HttpError } from '../middleware/error';
import projects from '../db/projects.json';
interface ProjectRow extends RowDataPacket { id: number; slug: string; title: string; category: string; year: number; description: string; thumbnail: string; accentColor: string; liveUrl: string; repoUrl: string; techName: string | null }
const select = 'SELECT p.id, p.slug, p.title, p.category, p.year, p.description, p.thumbnail, p.accent_color AS accentColor, p.live_url AS liveUrl, p.repo_url AS repoUrl, t.name AS techName FROM projects p LEFT JOIN project_tech t ON t.project_id = p.id';
async function list(slug?: string) {
  if (env.DEMO_MODE) return slug ? projects.filter((project) => project.slug === slug) : projects;
  const [rows] = await pool.execute<ProjectRow[]>(`${select}${slug ? ' WHERE p.slug = ?' : ''} ORDER BY p.sort_order, p.id, t.sort_order`, slug ? [slug] : []);
  const result: typeof projects = [];
  for (const row of rows) { let project = result.find((item) => item.id === row.id); if (!project) { const fields = row; project = { id: fields.id, slug: fields.slug, title: fields.title, category: fields.category, year: fields.year, description: fields.description, thumbnail: fields.thumbnail, accentColor: fields.accentColor, liveUrl: fields.liveUrl, repoUrl: fields.repoUrl, tech: [] }; result.push(project); } if (row.techName) project.tech.push(row.techName); }
  return result;
}
export const projectsRouter = Router();
projectsRouter.get('/', async (_request, response) => { response.set('Cache-Control', 'public, max-age=60').json(await list()); });
projectsRouter.get('/:slug', async (request, response) => { const slug = z.string().regex(/^[a-z0-9-]+$/).max(100).parse(request.params.slug); const project = (await list(slug))[0]; if (!project) throw new HttpError(404, 'Project not found.'); response.json(project); });

