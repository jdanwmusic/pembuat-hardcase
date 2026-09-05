import { Metadata } from 'next';

export function generateSeo(
  title: string,
  description?: string,
  path?: string
): Metadata {
  const url = `http://localhost:3000${path || ''}`;
  return {
    title: `${title} - Pembuat Hardcase`,
    description: description || 'Pembuat Hardcase - Database Peralatan Musik',
    openGraph: {
      title,
      description: description || '',
      url,
      siteName: 'Pembuat Hardcase',
      locale: 'id_ID',
      type: 'website',
    },
    alternates: { canonical: url },
  };
}
