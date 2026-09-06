import { Metadata } from 'next';
import Link from 'next/link';
import { findEquipment } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Equipment - Pembuat Hardcase',
  description: 'Daftar peralatan musik dan rekomendasi hardcase.',
  alternates: { canonical: 'https://www.pembuathardcase.com/equipment' },
};

export const dynamic = 'force-dynamic';
export default async function EquipmentPage() {
  const items = await findEquipment();

  return (
    <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
      <nav style={{ fontSize: '0.85rem', color: '#777', marginBottom: '1rem' }}>
        <Link href="/">Beranda</Link> / Equipment
      </nav>
      <h1 style={{ fontSize: '2rem', color: '#0a0a0c', marginBottom: '0.5rem' }}>Equipment</h1>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        {items.length > 0 ? `Total ${items.length} peralatan dari database D1 (Payload CMS)` : 'Database kosong — tambah data via Payload Admin'}
      </p>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {items.map((item: any) => (
          <Link key={item.id} href={`/equipment/${item.id}`} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: 8, textDecoration: 'none', background: '#fff', color: '#0a0a0c' }}>
            <h3 style={{ margin: 0, color: '#0a0a0c', fontSize: '1.1rem' }}>{item.modelName || item.brand?.name || `Equipment #${item.id}`}</h3>
            <p style={{ margin: '0.5rem 0 0', color: '#555', fontSize: '0.9rem' }}>
              <strong>Brand:</strong> {item.brand?.name || '—'}<br />
              <strong>Kategori:</strong> {item.category?.name || '—'}<br />
              <strong>Berat:</strong> {item.weightKg || '—'} kg
            </p>
          </Link>
        ))}
      </section>
    </main>
  );
}
