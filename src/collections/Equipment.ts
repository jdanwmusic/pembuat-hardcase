import { CollectionConfig } from 'payload';

export const Equipment: CollectionConfig = {
  slug: 'equipment',
  labels: { singular: 'Equipment', plural: 'Equipment' },
  admin: { useAsTitle: 'modelName' },
  fields: [
    { name: 'modelName', type: 'text', required: true, label: 'Model Name' },
    { name: 'brand', type: 'relationship', relationTo: 'brands', label: 'Brand' },
    { name: 'category', type: 'relationship', relationTo: 'categories', label: 'Category' },
    {
      name: 'dimensions',
      type: 'group',
      label: 'Dimensions (mm)',
      fields: [
        { name: 'length', type: 'number', label: 'Length (mm)' },
        { name: 'width', type: 'number', label: 'Width (mm)' },
        { name: 'height', type: 'number', label: 'Height (mm)' },
      ],
    },
    { name: 'weightKg', type: 'number', label: 'Weight (kg)' },
    {
      name: 'recommendedCaseSize',
      type: 'group',
      label: 'Recommended Case Size (mm)',
      fields: [
        { name: 'length', type: 'number', label: 'Length (mm)' },
        { name: 'width', type: 'number', label: 'Width (mm)' },
        { name: 'height', type: 'number', label: 'Height (mm)' },
      ],
    },
    { name: 'caseType', type: 'select', options: ['Hardcase', 'Gig Bag', 'Flight Case', 'Soft Case'], label: 'Case Type' },
    { name: 'notes', type: 'textarea', label: 'Notes' },
    { name: 'images', type: 'upload', relationTo: 'media', label: 'Images' },
    { name: 'published', type: 'checkbox', label: 'Published' },
  ],
};
