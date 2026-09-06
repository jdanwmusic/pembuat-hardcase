import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://www.pembuathardcase.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, lastModified: new Date() },
    { url: `${BASE}/equipment`, lastModified: new Date() },
    { url: `${BASE}/brands`, lastModified: new Date() },
    { url: `${BASE}/articles`, lastModified: new Date() },
  ];
}
