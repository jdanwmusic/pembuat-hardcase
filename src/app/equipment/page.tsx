import { Metadata } from 'next';
import Link from 'next/link';


export const metadata: Metadata = {
  title: 'Equipment - Pembuat Hardcase',
  description: 'Daftar peralatan musik dan rekomendasi hardcase.',
  alternates: { canonical: 'http://localhost:3000/equipment' },
};

const pg = require('pg');
const { Client } = pg;

async function getEquipment() {
  try {
    const client = new (require('pg').Client)({
      connectionString: process.env.DATABASE_URL || 'postgres://payload:payload@localhost:5433/payload',
    });
    await client.connect();
    const res = await client.query('SELECT id, brand, modelname, category, weight_kg, casetype FROM equipment ORDER BY id DESC');
    await client.end();
    return res.rows;
  } catch (e) {
    console.error('DB error:', (e as Error).message);
    return [];
  }
}

export default async function EquipmentPage() {
  const items = await getEquipment();
  return (
    <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
      <nav style={{ fontSize: '0.85rem', color: '#777', marginBottom: '1rem' }}>
        <Link href="/">Beranda</Link> / Equipment
      </nav>
      <h1 style={{ fontSize: '2rem', color: '#0a0a0c', marginBottom: '0.5rem' }}>Equipment</h1>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        {items.length > 0 ? `Total ${items.length} peralatan dari database PostgreSQL` : 'Database kosong — tambah data via Payload Admin'}
      </p>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {items.map((item: any) => (
          <Link key={item.id} href={`/equipment/${item.id}`} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: 8, textDecoration: 'none', background: '#fff', color: '#0a0a0c' }}>
            <h3 style={{ margin: 0, color: '#0a0a0c', fontSize: '1.1rem' }}>{item.modelname || item.brand || `Equipment #${item.id}`}</h3>
            <p style={{ margin: '0.5rem 0 0', color: '#555', fontSize: '0.9rem' }}>
              <strong>Brand:</strong> {item.brand || '—'}<br />
              <strong>Kategori:</strong> {item.category || '—'}<br />
              <strong>Berat:</strong> {item.weight_kg || '—'} kg
            </p>
          </Link>
        ))}
      </section>
    </main>
  );
}
