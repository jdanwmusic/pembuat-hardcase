import { Metadata } from 'next';
interface Props { params: Promise<{ slug: string }>; }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Artikel: ${slug}`,
    description: `Artikel tentang ${slug}`,
    alternates: { canonical: `http://localhost:3000/artikel/${slug}` },
  };
}
export default async function ArtikelDetail({ params }: Props) {
  const { slug } = await params;
  return (
    <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
      <nav style={{ fontSize: '0.85rem', color: '#777', marginBottom: '1rem' }}>
        <a href="/">Beranda</a> / <a href="/artikel">Artikel</a> / {slug}
      </nav>
      <h1 style={{ textTransform: 'capitalize' }}>{slug}</h1>
      <p>Konten akan dimuat dari Payload CMS.</p>
    </main>
  );
}
