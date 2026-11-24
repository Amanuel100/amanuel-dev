import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import { fileURLToPath, URL } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';

function localContactPlugin(): Plugin {
  return {
    name: 'local-api-contact-handler',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.statusCode = 200;
          res.end();
          return;
        }
        if (req.method !== 'POST') {
          return next();
        }
        let body = '';
        req.on('data', (chunk: Buffer) => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          try {
            const { default: handler } = await import('./api/contact.js');
            const mockReq = { method: 'POST', body };
            const mockRes = {
              setHeader: (key: string, value: string) => res.setHeader(key, value),
              status: (code: number) => {
                res.statusCode = code;
                return {
                  json: (payload: unknown) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(payload));
                  },
                  end: () => res.end(),
                };
              },
            };
            await handler(mockReq, mockRes);
          } catch {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Internal server error in local contact handler' }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (env.RESEND_API_KEY) process.env.RESEND_API_KEY = env.RESEND_API_KEY;
  if (env.RESEND_FROM_EMAIL) process.env.RESEND_FROM_EMAIL = env.RESEND_FROM_EMAIL;
  if (env.CONTACT_TO_EMAIL) process.env.CONTACT_TO_EMAIL = env.CONTACT_TO_EMAIL;
  if (env.RESEND_TO_EMAIL) process.env.RESEND_TO_EMAIL = env.RESEND_TO_EMAIL;
  if (env.MAIL_TO) process.env.MAIL_TO = env.MAIL_TO;

  return {
    plugins: [react(), glsl(), localContactPlugin()],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: { port: 5173, strictPort: true, proxy: { '/api': 'http://127.0.0.1:4000' } },
    preview: { port: 4173, proxy: { '/api': 'http://127.0.0.1:4000' } },
    build: {
      target: 'es2022',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (/node_modules[\\/]three[\\/]/.test(id)) return 'three';
            if (id.includes('gsap')) return 'gsap';
            if (/framer-motion|motion-dom|motion-utils/.test(id)) return 'motion';
            if (/node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|zustand|zod|react-hook-form|react-helmet-async)[\\/]/.test(id)) return 'vendor';
            return undefined;
          },
        },
      },
    },
  };
});
