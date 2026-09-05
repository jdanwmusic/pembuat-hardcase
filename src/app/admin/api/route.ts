import { NextResponse } from 'next/server';

const ALLOWED = new Set(['equipment', 'articles', 'brands', 'categories', 'materials', 'hardcase_templates', 'media']);

async function getClient() {
  const pg = require('pg');
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL || 'postgres://payload:***@localhost:5433/payload' });
  await c.connect();
  return c;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const table = url.searchParams.get('table');
  const id = url.searchParams.get('id');
  if (table && !ALLOWED.has(table)) return NextResponse.json({ ok: false, error: 'invalid table' }, { status: 400 });
  try {
    const c = await getClient();
    let res;
    if (id) res = await c.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
    else if (table) res = await c.query(`SELECT * FROM ${table} ORDER BY id DESC`);
    else res = await c.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
    await c.end();
    return NextResponse.json({ ok: true, data: res.rows });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { table, data } = body;
  if (!ALLOWED.has(table)) return NextResponse.json({ ok: false, error: 'invalid table' }, { status: 400 });
  try {
    const c = await getClient();
    const cols = Object.keys(data);
    const vals = Object.values(data);
    const placeholders = vals.map((_, i) => `$${i + 1}`).join(', ');
    const q = `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    const res = await c.query(q, vals);
    await c.end();
    return NextResponse.json({ ok: true, data: res.rows[0] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { table, id } = body;
  if (!ALLOWED.has(table)) return NextResponse.json({ ok: false, error: 'invalid table' }, { status: 400 });
  try {
    const c = await getClient();
    const res = await c.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [id]);
    await c.end();
    return NextResponse.json({ ok: true, deleted: res.rowCount });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
