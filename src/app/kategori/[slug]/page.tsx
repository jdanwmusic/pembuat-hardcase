import { Metadata } from 'next';
interface Props { params: Promise<{ slug: string }>; }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Kategori: ${slug}`,
    description: `Kategori ${slug}`,
    alternates: { canonical: `http://localhost:3000/kategori/${slug}` },
  };
}
export default async function KategoriDetail({ params }: Props) {
  const { slug } = await params;
  return (
    <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
      <nav style={{ fontSize: '0.85rem', color: '#777', marginBottom: '1rem' }}>
        <a href="/">Beranda</a> / Kategori / {slug}
      </nav>
      <h1>Kategori: {slug}</h1>
      <p>Daftar equipment dalam kategori ini akan dimuat dari Payload.</p>
    </main>
  );
}
