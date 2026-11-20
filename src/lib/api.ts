import type { ContactInput, ContactResponse, Project, Testimonial } from '@/types';
const baseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '/api';
export class ApiError extends Error { constructor(message: string, public status: number) { super(message); } }
export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers }, signal: options.signal ?? AbortSignal.timeout(12000) });
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string' ? data.message : 'The server is unavailable. Please try again.';
    throw new ApiError(message, response.status);
  }
  return data as T;
}
export const api = {
  projects: (signal?: AbortSignal) => request<Project[]>('/projects', { signal }),
  testimonials: (signal?: AbortSignal) => request<Testimonial[]>('/testimonials', { signal }),
  contact: (data: ContactInput) => request<ContactResponse>('/contact', { method: 'POST', body: JSON.stringify(data) })
};
