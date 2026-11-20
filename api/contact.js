import { z } from 'zod';

const inquiry = z.object({
  name: z.string().trim().min(2).max(100).regex(/^[^\r\n]+$/),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(3).max(150).regex(/^[^\r\n]+$/),
  budget: z.enum(['<$2k', '$2k–5k', '$5k–10k', '$10k+']),
  message: z.string().trim().min(20).max(5000),
}).strict();

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

export async function POST(request) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL || !process.env.CONTACT_TO_EMAIL) {
    return Response.json({ message: 'The contact service is not configured yet.' }, { status: 503 });
  }

  const parsed = inquiry.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ message: 'Please check the form details and try again.' }, { status: 400 });

  const { name, email, subject, budget, message } = parsed.data;
  const text = `From: ${name} <${email}>\nBudget: ${budget}\n\n${message}`;
  const html = `<h2>New portfolio inquiry</h2><p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p><strong>Budget:</strong> ${escapeHtml(budget)}</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, to: [process.env.CONTACT_TO_EMAIL], reply_to: email, subject: `Portfolio inquiry: ${subject}`, text, html }),
  });

  if (!response.ok) {
    console.error('Resend request failed', { status: response.status });
    return Response.json({ message: 'Unable to send your message right now. Please email me directly.' }, { status: 502 });
  }

  return Response.json({ message: 'Your inquiry has been received.' }, { status: 201 });
}
