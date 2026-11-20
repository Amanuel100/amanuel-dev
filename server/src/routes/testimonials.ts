import { Router } from 'express';
import type { RowDataPacket } from 'mysql2';
import { env } from '../config';
import { pool } from '../db/pool';
import testimonials from '../db/testimonials.json';
export const testimonialsRouter = Router();
testimonialsRouter.get('/', async (_request, response) => {
  if (env.DEMO_MODE) { response.json(testimonials); return; }
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT id, quote, name, role, company, avatar FROM testimonials WHERE published = ? ORDER BY sort_order, id', [true]);
  response.set('Cache-Control', 'public, max-age=60').json(rows);
});
