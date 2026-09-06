import { Metadata } from 'next';
import { findCategories } from '@/lib/db';

interface Props { params: Promise<{ slug: string }>; }

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://www.pembuathardcase.com';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Kategori: ${slug}`,
    description: `Kategori ${slug}`,
    alternates: { canonical: `${BASE}/kategori/${slug}` },
  };
}

export const dynamic = 'force-dynamic';
export default async function KategoriDetail({ params }: Props) {
  const { slug } = await params;
  const categories = await findCategories();
  const current = categories.find((c: any) => c.slug === slug);
  return (
    <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
      <nav style={{ fontSize: '0.85rem', color: '#777', marginBottom: '1rem' }}>
        <a href="/">Beranda</a> / Kategori / {slug}
      </nav>
      <h1>Kategori: {current?.name || slug}</h1>
      {current?.description && <p style={{ color: '#555' }}>{current.description}</p>}
    </main>
  );
}
