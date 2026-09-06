// src/lib/db.ts — Database access using Payload Local API (D1-backed via @payloadcms/db-d1-sqlite)
import payload from 'payload';

export async function findEquipment() {
  const result = await payload.find({
    collection: 'equipment',
    depth: 1,
    limit: 50,
  });
  return result.docs || [];
}

export async function findEquipmentBySlug(slug: string) {
  const result = await payload.find({
    collection: 'equipment',
    depth: 1,
    where: { slug: { equals: slug } },
  });
  return result.docs?.[0] || null;
}

export async function findArticles() {
  const result = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 20,
  });
  return result.docs || [];
}

export async function findArticleBySlug(slug: string) {
  const result = await payload.find({
    collection: 'articles',
    depth: 1,
    where: { slug: { equals: slug } },
  });
  return result.docs?.[0] || null;
}

export async function findBrands() {
  const result = await payload.find({ collection: 'brands', limit: 50 });
  return result.docs || [];
}

export async function findCategories() {
  const result = await payload.find({ collection: 'categories', limit: 50 });
  return result.docs || [];
}

export async function search(query: string) {
  const q = `%${query}%`;
  const eq = await payload.find({
    collection: 'equipment',
    depth: 0,
    limit: 10,
    where: { modelName: { like: q } },
  });
  const art = await payload.find({
    collection: 'articles',
    depth: 0,
    limit: 10,
    where: { title: { like: q } },
  });
  return { equipment: eq.docs || [], articles: art.docs || [] };
}
