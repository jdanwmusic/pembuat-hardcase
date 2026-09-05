import { Metadata } from 'next';
import Link from 'next/link';


export const metadata: Metadata = { title: 'Artikel - Pembuat Hardcase', alternates: { canonical: 'http://localhost:3000/articles' } };

async function getArticles() {
  try {
    const client = new (require('pg').Client)({ connectionString: process.env.DATABASE_URL || 'postgres://payload:payload@localhost:5433/payload' });
    await client.connect();
    const res = await client.query('SELECT id, title, slug, excerpt, category, created_at FROM articles ORDER BY created_at DESC');
    await client.end();
    return res.rows;
  } catch { return []; }
}

export default async function ArticlesPage() {
  const articles = await getArticles();
  return (
    <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Artikel</h1>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        {articles.length > 0 ? `Total ${articles.length} artikel` : 'Belum ada artikel. Tambahkan via Payload Admin.'}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {articles.length === 0 && (
          <div style={{ padding: '1.5rem', background: '#f8f7f5', borderRadius: 8, textAlign: 'center' }}>
            <p>Belum ada artikel. <Link href="/equipment" style={{ color: '#c9a84c' }}>Lihat Equipment</Link></p>
          </div>
        )}
        {articles.map((a: any) => (
          <Link key={a.id} href={`/artikel/${a.id}`} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: 8, textDecoration: 'none', background: '#fff', color: '#0a0a0c' }}>
            <h3 style={{ margin: 0, color: '#0a0a0c' }}>{a.title}</h3>
            <p style={{ margin: '0.25rem 0 0', color: '#777', fontSize: '0.9rem' }}>{a.excerpt || 'Tidak ada excerpt'} · {a.category || '—'}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
