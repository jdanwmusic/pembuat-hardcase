import { Metadata } from 'next';
export const metadata: Metadata = { title: 'Brand - Pembuat Hardcase' };
export default function BrandsPage() {
  return <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}><h1>Brand</h1><p>Data brand dari Payload Admin.</p></main>;
}
