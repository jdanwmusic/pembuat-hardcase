import { Metadata } from 'next';

export function generateSeo(
  title: string,
  description?: string,
  path?: string
): Metadata {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://www.pembuathardcase.com';
  const url = `${base}${path || ''}`;
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
