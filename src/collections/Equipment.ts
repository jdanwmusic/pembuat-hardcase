import { CollectionConfig } from 'payload';

export const Equipment: CollectionConfig = {
  slug: 'equipment',
  labels: { singular: 'Equipment', plural: 'Equipment' },
  admin: { useAsTitle: 'modelName' },
  fields: [
    { name: 'brand', type: 'text', required: true, label: 'Brand' },
    { name: 'category', type: 'select', options: ['Drums', 'Guitar', 'Bass', 'Keyboard', 'Percussion'], label: 'Category' },
    { name: 'modelName', type: 'text', required: true, label: 'Model Name' },
    { name: 'dimensions', type: 'group', label: 'Dimensions (mm)', fields: [
      { name: 'length', type: 'number' },
      { name: 'width', type: 'number' },
      { name: 'height', type: 'number' },
    ]},
    { name: 'weight_kg', type: 'number', label: 'Weight (kg)' },
    { name: 'recommendedCaseSize', type: 'group', label: 'Recommended Case Size (mm)', fields: [
      { name: 'length', type: 'number' },
      { name: 'width', type: 'number' },
      { name: 'height', type: 'number' },
    ]},
    { name: 'images', type: 'upload', relationTo: 'media', label: 'Images' },
  ],
};
