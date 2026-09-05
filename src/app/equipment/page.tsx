import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Equipment - Pembuat Hardcase',
  description: 'Daftar peralatan musik dan rekomendasi hardcase.',
};
export default function EquipmentPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Equipment</h1>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>Peralatan musik dan data dimensi untuk menentukan case yang tepat.</p>
    </main>
  );
}
