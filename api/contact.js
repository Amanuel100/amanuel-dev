import { z } from 'zod';

const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100).regex(/^[^\r\n]+$/, 'Invalid name format'),
  email: z.string().trim().email('Invalid email address').max(254),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters').max(150).regex(/^[^\r\n]+$/, 'Invalid subject format'),
  budget: z.enum(['<$2k', '$2k–5k', '$5k–10k', '$10k+']),
  message: z.string().trim().min(20, 'Message must be at least 20 characters').max(5000),
}).strict();

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char] || char));
}

function generateEmailHtml({ name, email, subject, budget, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeBudget = escapeHtml(budget);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Portfolio Inquiry</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#05060a;color:#f5f5f7;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#05060a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background:#0d0f18;border:1px solid rgba(255,255,255,0.12);border-radius:12px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.5);">
          <!-- Header Banner -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed 0%,#22d3ee 100%);padding:24px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;letter-spacing:-0.02em;font-weight:700;">New Portfolio Inquiry</h1>
              <p style="margin:6px 0 0 0;color:rgba(255,255,255,0.9);font-size:13px;letter-spacing:0.05em;text-transform:uppercase;">amanueleyob.dev</p>
            </td>
          </tr>
          <!-- Content Body -->
          <tr>
            <td style="padding:32px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.08);width:120px;color:#8b8fa3;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Sender</td>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#f5f5f7;font-size:15px;font-weight:600;">
                    ${safeName} &lt;<a href="mailto:${safeEmail}" style="color:#22d3ee;text-decoration:none;">${safeEmail}</a>&gt;
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#8b8fa3;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Subject</td>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#f5f5f7;font-size:15px;font-weight:600;">${safeSubject}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#8b8fa3;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Budget</td>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#a78bfa;font-size:14px;font-weight:600;">
                    <span style="display:inline-block;padding:3px 10px;background:rgba(124,58,237,0.2);border:1px solid rgba(124,58,237,0.4);border-radius:20px;">${safeBudget}</span>
                  </td>
                </tr>
              </table>

              <div style="margin-top:24px;">
                <p style="margin:0 0 10px 0;color:#8b8fa3;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Message</p>
                <div style="background:#06070c;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:20px;color:#e2e4ec;font-size:15px;line-height:1.6;">
                  ${safeMessage}
                </div>
              </div>

              <div style="margin-top:32px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">
                <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(subject)}" style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:6px;box-shadow:0 4px 14px rgba(124,58,237,0.4);">
                  Reply Directly to ${safeName} &rarr;
                </a>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#090a12;padding:16px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);color:#6b7280;font-size:12px;">
              Sent via Portfolio Contact Form &bull; Protected with Resend API
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

async function processInquiry(body) {
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues?.[0]?.message || 'Please check your input details and try again.';
    return {
      status: 400,
      data: { message: errorMsg }
    };
  }

  const { name, email, subject, budget, message } = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === 're_replace_with_your_resend_api_key') {
    if (process.env.NODE_ENV === 'production') {
      console.error('[Contact Error] RESEND_API_KEY is missing in production environment.');
      return {
        status: 503,
        data: { message: 'Contact service is not configured yet. Please email me directly at amanuel@amanueleyob.dev.' }
      };
    }
    console.log('[Contact Form Demo Submission]', { name, email, subject, budget, message });
    return {
      status: 201,
      data: {
        message: 'Demo mode: Message received locally. Add RESEND_API_KEY in Vercel to send real emails.',
        mode: 'demo',
        id: Date.now()
      }
    };
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || process.env.RESEND_TO_EMAIL || process.env.MAIL_TO || 'amanueleyob100@gmail.com';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>';

  const html = generateEmailHtml({ name, email, subject, budget, message });
  const text = `New Portfolio Inquiry\n\nFrom: ${name} <${email}>\nSubject: ${subject}\nBudget: ${budget}\n\nMessage:\n${message}\n`;

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `Portfolio Inquiry: ${subject} (${name})`,
        text,
        html
      })
    });

    const resendData = await resendResponse.json().catch(() => null);

    if (!resendResponse.ok) {
      console.error('[Resend API Error]', {
        status: resendResponse.status,
        data: resendData
      });
      const errorDetail = resendData?.message || 'Unable to deliver message through Resend.';
      return {
        status: 502,
        data: {
          message: `${errorDetail} Please reach out to me directly at amanuel@amanueleyob.dev.`
        }
      };
    }

    return {
      status: 201,
      data: {
        message: 'Your inquiry has been received. Thank you for getting in touch!',
        mode: 'live',
        id: resendData?.id || Date.now()
      }
    };
  } catch (networkError) {
    console.error('[Network Error connecting to Resend]', networkError);
    return {
      status: 502,
      data: {
        message: 'Failed to contact the email provider. Please email directly at amanuel@amanueleyob.dev.'
      }
    };
  }
}

// Default export for Vercel Serverless Function (Node.js runtime)
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      res.status(400).json({ message: 'Invalid JSON payload' });
      return;
    }
  }

  const result = await processInquiry(body);
  res.status(result.status).json(result.data);
}

// Export for Vercel Edge Runtime or Web Standards (if Edge runtime is enabled)
export async function POST(request) {
  const body = await request.json().catch(() => null);
  const result = await processInquiry(body);
  return Response.json(result.data, {
    status: result.status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept'
    }
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept'
    }
  });
}
