import { Metadata } from 'next';
import Link from 'next/link';
import { search } from '@/lib/db';

export const metadata: Metadata = { title: 'Cari - Pembuat Hardcase', alternates: { canonical: 'https://www.pembuathardcase.com/search' } };

export const dynamic = 'force-dynamic';
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const results = q ? await search(q) : { equipment: [], articles: [] };

  return (
    <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
      <h1>Cari</h1>
      <form style={{ margin: '1rem 0' }}>
        <input name="q" defaultValue={q} placeholder="Ketik untuk mencari..." style={{ padding: '0.5rem', width: '100%', maxWidth: 480, borderRadius: 6, border: '1px solid #ccc', fontSize: '1rem' }} />
        <button type="submit" style={{ marginLeft: 8, padding: '0.5rem 1rem', borderRadius: 6, border: 0, background: '#0a0a0c', color: '#fff', fontSize: '1rem' }}>Cari</button>
      </form>
      {!q && <p style={{ color: '#777' }}>Masukkan kata kunci untuk mencari equipment atau artikel.</p>}
      {q && results.equipment.length === 0 && results.articles.length === 0 && <p style={{ color: '#777' }}>Tidak ditemukan hasil untuk "{q}".</p>}
      {results.equipment.length > 0 && (
        <section style={{ marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>Equipment ({results.equipment.length})</h2>
          {results.equipment.map((e: any) => (
            <Link key={e.id} href={`/equipment/${e.id}`} style={{ display: 'block', padding: '0.75rem', borderBottom: '1px solid #eee', textDecoration: 'none', color: '#0a0a0c' }}>
              <strong>{e.modelName || `Equipment #${e.id}`}</strong> — {e.brand?.name || '—'} ({e.category?.name || '—'})
            </Link>
          ))}
        </section>
      )}
      {results.articles.length > 0 && (
        <section style={{ marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>Artikel ({results.articles.length})</h2>
          {results.articles.map((a: any) => (
            <Link key={a.id} href={`/artikel/${a.id}`} style={{ display: 'block', padding: '0.75rem', borderBottom: '1px solid #eee', textDecoration: 'none', color: '#0a0a0c' }}>
              <strong>{a.title}</strong> {a.excerpt ? `— ${String(a.excerpt).substring(0, 80)}...` : ''}
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
