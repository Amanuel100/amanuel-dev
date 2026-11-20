import nodemailer from 'nodemailer';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { env } from '../config';
import { pool } from '../db/pool';
export const transport = nodemailer.createTransport({ host: env.SMTP_HOST, port: env.SMTP_PORT, secure: env.SMTP_SECURE, auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined, connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 10000, tls: { minVersion: 'TLSv1.2' } });
interface MailContact extends RowDataPacket { id: number; name: string; email: string; subject: string; budget: string; message: string }
let running = false;
export async function deliverPendingMail() {
  if (env.DEMO_MODE || running) return; running = true;
  try {
    const [rows] = await pool.execute<MailContact[]>("SELECT id, name, email, subject, budget, message FROM contacts WHERE (mail_status = 'pending' OR (mail_status = 'sending' AND updated_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 5 MINUTE))) AND mail_attempts < 5 ORDER BY id LIMIT 10");
    for (const contact of rows) {
      const [claim] = await pool.execute<ResultSetHeader>("UPDATE contacts SET mail_status = 'sending', mail_attempts = mail_attempts + 1 WHERE id = ? AND (mail_status = 'pending' OR (mail_status = 'sending' AND updated_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 5 MINUTE)))", [contact.id]);
      if (!claim.affectedRows) continue;
      try { await transport.sendMail({ from: env.MAIL_FROM, to: env.MAIL_TO, replyTo: { name: contact.name, address: contact.email }, subject: `Portfolio inquiry #${contact.id}: ${contact.subject}`, text: `From: ${contact.name} <${contact.email}>\nBudget: ${contact.budget}\n\n${contact.message}` }); await pool.execute("UPDATE contacts SET mail_status = 'sent' WHERE id = ?", [contact.id]); }
      catch { await pool.execute("UPDATE contacts SET mail_status = 'pending' WHERE id = ?", [contact.id]); console.error(JSON.stringify({ event: 'mail_retry_pending', contactId: contact.id })); }
    }
  } finally { running = false; }
}
export function startMailWorker() { if (env.DEMO_MODE) return () => {}; const timer = setInterval(() => { void deliverPendingMail().catch(() => console.error('{"event":"mail_worker_unavailable"}')); }, 60000); timer.unref(); return () => clearInterval(timer); }
