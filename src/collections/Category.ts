import { CollectionConfig } from 'payload';

export const Category: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Category', plural: 'Categories' },
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
  ],
};
