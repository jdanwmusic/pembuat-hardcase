import { CollectionConfig } from 'payload';

export const Brand: CollectionConfig = {
  slug: 'brands',
  labels: { singular: 'Brand', plural: 'Brands' },
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Brand Name' },
    { name: 'slug', type: 'text', required: true, label: 'Slug' },
    { name: 'description', type: 'text', label: 'Description' },
    { name: 'country', type: 'text', label: 'Country of Origin' },
  ],
};
