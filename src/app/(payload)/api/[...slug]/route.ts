import type { NextRequest } from 'next/server';
export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
  return new Response(`API endpoint: /api/${(params.slug || []).join('/')}`, { status: 200 });
}
