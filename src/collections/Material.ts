import { CollectionConfig } from 'payload';

export const Material: CollectionConfig = {
  slug: 'materials',
  labels: { singular: 'Material', plural: 'Materials' },
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'type', type: 'select', options: ['Wood', 'ABS Plastic', 'Plywood', 'Foam', 'Metal'], label: 'Type' },
    { name: 'description', type: 'textarea' },
  ],
};
