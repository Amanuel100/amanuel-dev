import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
export class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }
export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  if (response.headersSent) { _next(error); return; }
  if (error instanceof ZodError) { response.status(400).json({ message: 'Please check the submitted fields.', errors: error.flatten().fieldErrors }); return; }
  if (error instanceof HttpError) { response.status(error.status).json({ message: error.message }); return; }
  if (error instanceof SyntaxError && 'body' in error) { response.status(400).json({ message: 'Invalid JSON body.' }); return; }
  if (typeof error === 'object' && error !== null && 'status' in error && error.status === 413) { response.status(413).json({ message: 'Request body is too large.' }); return; }
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : 'UNKNOWN';
  console.error(JSON.stringify({ event: 'request_failed', code }));
  const unavailable = ['ECONNREFUSED', 'ETIMEDOUT', 'ER_ACCESS_DENIED_ERROR', 'ER_BAD_DB_ERROR', 'ER_NO_SUCH_TABLE'].includes(code);
  response.status(unavailable ? 503 : 500).json({ message: unavailable ? 'The service is temporarily unavailable. Please try again shortly.' : 'An unexpected error occurred.' });
};
