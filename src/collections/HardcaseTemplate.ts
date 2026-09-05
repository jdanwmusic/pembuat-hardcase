import { CollectionConfig } from 'payload';

export const HardcaseTemplate: CollectionConfig = {
  slug: 'hardcase-templates',
  labels: { singular: 'Template', plural: 'Hardcase Templates' },
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'dimensions', type: 'group', fields: [
      { name: 'length', type: 'number' },
      { name: 'width', type: 'number' },
      { name: 'height', type: 'number' },
    ]},
    { name: 'compatibleEquipment', type: 'relationship', relationTo: 'equipment', label: 'Compatible Equipment' },
  ],
};
