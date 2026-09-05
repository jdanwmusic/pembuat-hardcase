import { Metadata } from 'next';
export const metadata: Metadata = { title: 'Cari - Pembuat Hardcase' };
export default function SearchPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
      <h1>Cari</h1>
      <p>Mencari equipment, artikel, brand, material.</p>
    </main>
  );
}
