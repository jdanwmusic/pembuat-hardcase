import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const table = url.searchParams.get('table') || 'equipment';
  try {
    const pg = require('pg');
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL || 'postgres://payload:payload@localhost:5433/payload' });
    await client.connect();
    const res = await client.query(`SELECT * FROM "${table}" LIMIT 50`);
    await client.end();
    return NextResponse.json({ table, count: res.rowCount, rows: res.rows });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
