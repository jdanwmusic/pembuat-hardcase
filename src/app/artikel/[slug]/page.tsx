import { Metadata } from 'next';
import Link from 'next/link';
import { findArticleBySlug } from '@/lib/db';

interface Props { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Artikel #${slug}`, alternates: { canonical: `https://www.pembuathardcase.com/artikel/${slug}` } };
}

export const dynamic = 'force-dynamic';
export default async function ArtikelDetail({ params }: Props) {
  const { slug } = await params;
  const article = await findArticleBySlug(slug);

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
            Kategori: <strong>{article.category?.name || '—'}</strong>
          </div>
          {article.excerpt && <p style={{ fontSize: '1.1rem', color: '#444', borderLeft: '3px solid #c9a84c', paddingLeft: '1rem', marginBottom: '1.5rem' }}>{article.excerpt}</p>}
          {article.content ? <div style={{ lineHeight: 1.8, color: '#333' }}><p>{typeof article.content === 'string' ? article.content : JSON.stringify(article.content)}</p></div> : <p style={{ color: '#777', fontStyle: 'italic' }}>Konten belum tersedia.</p>}
          <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}><Link href="/articles" style={{ color: '#c9a84c' }}>← Kembali ke Artikel</Link></div>
        </article>
      )}
    </main>
  );
}
