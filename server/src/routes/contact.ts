import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import type { ResultSetHeader } from 'mysql2';
import { pool } from '../db/pool';
import { env } from '../config';
import { saveDemoContact } from '../db/demo';
import { deliverPendingMail } from '../mail/transport';
export const contactSchema = z.object({ name: z.string().trim().min(2).max(100).regex(/^[^\r\n]+$/), email: z.string().trim().email().max(254), subject: z.string().trim().min(3).max(150).regex(/^[^\r\n]+$/), budget: z.enum(['<$2k', '$2k–5k', '$5k–10k', '$10k+']), message: z.string().trim().min(20).max(5000) }).strict();
export type ContactInput = z.infer<typeof contactSchema>;
export const contactRouter = Router();
contactRouter.post('/', rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false, message: { message: 'Too many inquiries. Please try again in one hour.' } }), async (request, response) => {
  const input = contactSchema.parse(request.body); let id: number;
  if (env.DEMO_MODE) id = await saveDemoContact(input);
  else {
    const [result] = await pool.execute<ResultSetHeader>('INSERT INTO contacts (name, email, subject, budget, message) VALUES (?, ?, ?, ?, ?)', [input.name, input.email, input.subject, input.budget, input.message]); id = result.insertId;
    void deliverPendingMail().catch(() => console.error('{"event":"mail_delivery_deferred"}'));
  }
  response.status(201).json({ message: env.DEMO_MODE ? 'Inquiry saved locally. Demo mode does not send email.' : 'Your inquiry has been received.', id, mode: env.DEMO_MODE ? 'demo' : 'live' });
});
