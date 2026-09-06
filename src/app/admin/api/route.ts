import { NextResponse } from 'next/server';
import payload from 'payload';

const ALLOWED = ['equipment', 'articles', 'brands', 'categories', 'materials', 'hardcase-templates', 'media'];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const table = url.searchParams.get('table') || 'equipment';
  const id = url.searchParams.get('id');
  if (!ALLOWED.includes(table)) return NextResponse.json({ ok: false, error: 'invalid table' }, { status: 400 });
  try {
    if (id) {
      const doc = await payload.findByID({ collection: table, id });
      return NextResponse.json({ ok: true, data: doc });
    } else {
      const result = await payload.find({ collection: table, limit: 50, depth: 1 });
      return NextResponse.json({ ok: true, data: result.docs });
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { table, data } = body;
  if (!ALLOWED.includes(table)) return NextResponse.json({ ok: false, error: 'invalid table' }, { status: 400 });
  try {
    const doc = await payload.create({ collection: table, data, depth: 0 });
    return NextResponse.json({ ok: true, data: doc });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { table, id } = body;
  if (!ALLOWED.includes(table)) return NextResponse.json({ ok: false, error: 'invalid table' }, { status: 400 });
  try {
    await payload.delete({ collection: table, id });
    return NextResponse.json({ ok: true, deleted: 1 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}
