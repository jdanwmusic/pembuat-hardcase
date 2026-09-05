import { Metadata } from 'next';
export const metadata: Metadata = { title: 'Artikel - Pembuat Hardcase' };
export default function ArticlesPage() {
  return <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}><h1>Artikel</h1><p>Artikel berdasarkan data PostgreSQL.</p></main>;
}
