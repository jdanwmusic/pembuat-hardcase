import { Metadata } from 'next';
import Link from 'next/link';
import { findEquipmentBySlug } from '@/lib/db';

interface Props { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Equipment #${slug}`, alternates: { canonical: `https://www.pembuathardcase.com/equipment/${slug}` } };
}

export const dynamic = 'force-dynamic';
export default async function EquipmentDetail({ params }: Props) {
  const { slug } = await params;
  const item = await findEquipmentBySlug(slug);
  const dim = item?.dimensions;

  return (
    <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
      <nav style={{ fontSize: '0.85rem', color: '#777', marginBottom: '1rem' }}>
        <Link href="/">Beranda</Link> / <Link href="/equipment">Equipment</Link> / {item ? (item.modelName || item.brand?.name) : `#${slug}`}
      </nav>
      {!item ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#777' }}>
          <h1>Equipment #{slug} tidak ditemukan</h1>
          <p>Data mungkin belum ada di database D1.</p>
          <Link href="/equipment" style={{ color: '#c9a84c' }}>← Kembali ke daftar</Link>
        </div>
      ) : (
        <article>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{item.modelName || `Equipment #${slug}`}</h1>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <section style={{ background: '#f8f7f5', padding: '1.5rem', borderRadius: 8 }}>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>Informasi</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {[['Brand', item.brand?.name], ['Kategori', item.category?.name], ['Tipe Case', item.caseType], ['Berat', item.weightKg ? `${item.weightKg} kg` : '—']].map(([k, v]) => v ? <tr key={k as string}><td style={{ padding: '0.25rem 0', color: '#555' }}>{k}:</td><td style={{ padding: '0.25rem 0', fontWeight: 600 }}>{v}</td></tr> : null)}
                </tbody>
              </table>
            </section>
            <section style={{ background: '#f8f7f5', padding: '1.5rem', borderRadius: 8 }}>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>Spesifikasi</h2>
              <p style={{ color: '#777', fontSize: '0.9rem' }}>Dimensi (mm):</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'center', background: '#fff', padding: '0.5rem', borderRadius: 4 }}><strong>{dim?.length || '—'}</strong><br /><small>L (mm)</small></div>
                <div style={{ textAlign: 'center', background: '#fff', padding: '0.5rem', borderRadius: 4 }}><strong>{dim?.width || '—'}</strong><br /><small>W (mm)</small></div>
                <div style={{ textAlign: 'center', background: '#fff', padding: '0.5rem', borderRadius: 4 }}><strong>{dim?.height || '—'}</strong><br /><small>H (mm)</small></div>
              </div>
            </section>
          </div>
          {item.notes && <section style={{ marginTop: '1.5rem', background: '#fff', padding: '1rem', borderRadius: 8, border: '1px solid #ddd' }}><h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Catatan</h2><p>{item.notes}</p></section>}
          <div style={{ marginTop: '2rem' }}><Link href="/equipment" style={{ color: '#c9a84c' }}>← Kembali ke daftar Equipment</Link></div>
        </article>
      )}
    </main>
  );
}
