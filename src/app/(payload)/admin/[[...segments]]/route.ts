import type { NextRequest } from 'next/server';
import { Payload } from 'payload';
import config from '../../../../payload.config.ts';

let payload: Payload | null = null;

async function getPayload(): Promise<Payload> {
  if (!payload) {
    payload = await Payload.init({
      config: config as any,
    });
  }
  return payload;
}

export async function GET(req: NextRequest, { params }: { params: { segments: string[] } }) {
  try {
    const p = await getPayload();
    const path = (params.segments || []).join('/');
    // Payload admin is a React SPA — serve the admin HTML
    const accept = req.headers.get('accept') || '';
    if (!path || path === '' || accept.includes('text/html')) {
      return new Response(
        `<!DOCTYPE html><html><head><title>Payload Admin</title></head><body><div id="payload-admin">Loading Payload Admin...</div></body></html>`,
        { headers: { 'content-type': 'text/html' } }
      );
    }
    return new Response('Payload Admin API', { status: 200 });
  } catch (e: any) {
    return new Response(`Error: ${e.message}`, { status: 500 });
  }
}
export async function POST(req: NextRequest, { params }: { params: { segments: string[] } }) {
  const p = await getPayload();
  return new Response('POST OK', { status: 200 });
}
