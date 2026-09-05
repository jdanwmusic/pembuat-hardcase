import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pembuat Hardcase — Database Peralatan Musik',
  description: 'Database peralatan musik terlengkap untuk menemukan hardcase yang tepat.',
  alternates: { canonical: 'http://localhost:3000/' },
  openGraph: { title: 'Pembuat Hardcase', description: 'Database Peralatan Musik — temukan hardcase yang tepat', locale: 'id_ID', type: 'website' },
};

export default async function HomePage() {
  let equipment: any[] = [];
  try {
    const res = await fetch('http://localhost:3000/api/db?table=equipment', { cache: 'no-store' });
    const data = await res.json();
    equipment = data.rows || [];
  } catch { /* placeholder if DB not available */ }

  return (
    <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ borderBottom: '2px solid #c9a84c', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#0a0a0c', marginBottom: 4 }}>Pembuat Hardcase</h1>
        <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Database Peralatan Musik — menemukan ukuran hardcase yang tepat untuk setiap alat musik Anda.
        </p>
      </header>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#0a0a0c', marginBottom: '0.75rem' }}>Koleksi Utama</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          <Link href="/equipment" style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: 8, textDecoration: 'none', color: '#0a0a0c' }}>
            <h3 style={{ margin: 0 }}>Equipment</h3>
            <p style={{ margin: '0.25rem 0 0', color: '#777', fontSize: '0.9rem' }}>Data dinamis dari PostgreSQL</p>
          </Link>
          <Link href="/brands" style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: 8, textDecoration: 'none', color: '#0a0a0c' }}>
            <h3 style={{ margin: 0 }}>Brand</h3>
            <p style={{ margin: '0.25rem 0 0', color: '#777', fontSize: '0.9rem' }}>Merek peralatan musik</p>
          </Link>
          <Link href="/articles" style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: 8, textDecoration: 'none', color: '#0a0a0c' }}>
            <h3 style={{ margin: 0 }}>Artikel</h3>
            <p style={{ margin: '0.25rem 0 0', color: '#777', fontSize: '0.9rem' }}>Panduan dan pengetahuan</p>
          </Link>
        </div>
      </section>

      {equipment.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#0a0a0c', marginBottom: '0.75rem' }}>Peralatan Terbaru</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {equipment.map((e: any) => (
              <Link key={e.id} href={`/equipment/${e.id}`} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: 8, textDecoration: 'none', background: '#fff' }}>
                <h3 style={{ margin: 0 }}>
                  {e.modelname || e.brand}
                </h3>
                <p style={{ margin: '0.25rem 0 0', color: '#777', fontSize: '0.9rem' }}>
                  Brand: {e.brand || '—'} · Kategori: {e.category || '—'} · Berat: {e.weight_kg || '—'} kg
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section style={{ background: '#f8f7f5', padding: '1.5rem', borderRadius: 8 }}>
        <h2 style={{ fontSize: '1.2rem', color: '#0a0a0c' }}>Tentang Proyek</h2>
        <p style={{ lineHeight: 1.7, color: '#333' }}>
          Pembuat Hardcase dibangun dengan fondasi <strong>Next.js + Payload CMS + PostgreSQL</strong>.
          Semua data tersimpan secara terstruktur — dari brand, kategori, dimensi, hingga rekomendasi ukuran case.
        </p>
        <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#777' }}>
          Version 0.1.0 — Foundation Phase | Node 20.19.0 | Payload 3.88.0 | Postgres 16
        </div>
      </section>
    </main>
  );
}
