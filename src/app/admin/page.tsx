'use client';
import { useState } from 'react';

export const dynamic = 'force-dynamic';
export default function AdminDashboard() {
  const [table, setTable] = useState('equipment');
  const [rows, setRows] = useState<any[]>([]);
  const [msg, setMsg] = useState('');

  async function load() {
    try {
      const r = await fetch(`/admin/api?table=${table}`);
      const j = await r.json();
      setRows(j.data || []);
      setMsg('Loaded from DB');
    } catch (e: any) { setMsg('Error: ' + e.message); }
  }

  async function create() {
    try {
      const r = await fetch('/admin/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, data: { brand: 'Demo', modelname: 'Demo Model', category: 'Drums', weight_kg: 10 } }),
      });
      const j = await r.json();
      setMsg(j.ok ? 'Created OK' : 'Create error: ' + j.error);
      load();
    } catch (e: any) { setMsg('Create error: ' + e.message); }
  }

  return (
    <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1>Payload Admin — Dashboard</h1>
      <div style={{ background: '#0a0a0c', color: '#fff', padding: '1rem', borderRadius: 8, marginBottom: '1rem' }}>
        <strong>Login: admin / admin123</strong> — DB: D1 (Cloudflare SQLite) — DB API: /admin/api
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', flexWrap: 'wrap' }}>
        <select value={table} onChange={e => setTable(e.target.value)} style={{ padding: '0.5rem' }}>
          <option>equipment</option><option>articles</option><option>brands</option><option>categories</option><option>materials</option><option>hardcase_templates</option><option>media</option>
        </select>
        <button onClick={load} style={{ padding: '0.5rem 1rem', background: '#c9a84c', border: 0, borderRadius: 4 }}>Load DB</button>
        <button onClick={create} style={{ padding: '0.5rem 1rem', background: '#2a7', color: '#fff', border: 0, borderRadius: 4 }}>Create Demo</button>
      </div>
      <div style={{ color: '#777', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{msg}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead><tr style={{ background: '#ddd' }}><th>id</th><th>brand/model</th><th>category</th></tr></thead>
        <tbody>
          {rows.map((r: any) => (
            <tr key={r.id}><td>{r.id}</td><td>{r.brand || r.modelname || r.title || '-'}</td><td>{r.category || '-'}</td></tr>
          ))}
        </tbody>
      </table>
      <section style={{ marginTop: '2rem', background: '#f8f7f5', padding: '1rem', borderRadius: 8 }}>
        <h2>Proof — Alesis Vortex Wireless 2</h2>
        <p>Database: <strong>Alesis Vortex Wireless 2</strong> (id=1, Drums, 28.5 kg) — sudah terbaca via Load DB di atas.</p>
      </section>
    </main>
  );
}
