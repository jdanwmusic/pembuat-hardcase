import { Metadata } from 'next';
import Link from 'next/link';


interface Props { params: Promise<{ slug: string }>; }

async function getArticle(id: string) {
  try {
    const client = new (require('pg').Client)({ connectionString: process.env.DATABASE_URL || 'postgres://payload:payload@localhost:5433/payload' });
    await client.connect();
    const res = await client.query('SELECT * FROM articles WHERE id = $1', [id]);
    await client.end();
    return res.rows[0] || null;
  } catch { return null; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Artikel #${slug}`, alternates: { canonical: `http://localhost:3000/artikel/${slug}` } };
}

export default async function ArtikelDetail({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  return (
    <main style={{ padding: '2rem', maxWidth: 768, margin: '0 auto' }}>
      <nav style={{ fontSize: '0.85rem', color: '#777', marginBottom: '1rem' }}>
        <Link href="/">Beranda</Link> / <Link href="/articles">Artikel</Link> / {article ? article.title : `#${slug}`}
      </nav>
      {!article ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h1>Artikel #{slug} tidak ditemukan</h1>
          <Link href="/articles" style={{ color: '#c9a84c' }}>← Kembali</Link>
        </div>
      ) : (
        <article>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{article.title}</h1>
          <div style={{ color: '#777', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Kategori: <strong>{article.category || '—'}</strong>
          </div>
          {article.excerpt && <p style={{ fontSize: '1.1rem', color: '#444', borderLeft: '3px solid #c9a84c', paddingLeft: '1rem', marginBottom: '1.5rem' }}>{article.excerpt}</p>}
          {article.content ? <div style={{ lineHeight: 1.8, color: '#333' }}><p>{article.content}</p></div> : <p style={{ color: '#777', fontStyle: 'italic' }}>Konten belum tersedia.</p>}
          <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}><Link href="/articles" style={{ color: '#c9a84c' }}>← Kembali ke Artikel</Link></div>
        </article>
      )}
    </main>
  );
}
