import type { IncomingMessage, ServerResponse } from 'node:http';

export interface MockRequest {
  method: string;
  body: unknown;
}

export interface MockResponse {
  setHeader: (key: string, value: string) => void;
  status: (code: number) => {
    json: (payload: unknown) => void;
    end: () => void;
  };
}

export default function handler(
  req: MockRequest | IncomingMessage,
  res: MockResponse | ServerResponse
): Promise<void>;

export function POST(request: Request): Promise<Response>;
export function OPTIONS(): Promise<Response>;
