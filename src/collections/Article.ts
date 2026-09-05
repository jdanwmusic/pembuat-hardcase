import { CollectionConfig } from 'payload';

export const Article: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Article', plural: 'Articles' },
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Title' },
    { name: 'slug', type: 'text', required: true, label: 'Slug' },
    { name: 'excerpt', type: 'textarea', label: 'Excerpt' },
    { name: 'content', type: 'richText', label: 'Content' },
    { name: 'category', type: 'relationship', relationTo: 'categories', label: 'Category' },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }], label: 'Tags' },
    { name: 'featuredImage', type: 'upload', relationTo: 'media', label: 'Featured Image' },
    { name: 'seoTitle', type: 'text', label: 'SEO Title' },
    { name: 'seoDescription', type: 'textarea', label: 'SEO Description' },
    { name: 'canonicalUrl', type: 'text', label: 'Canonical URL' },
  ],
};
