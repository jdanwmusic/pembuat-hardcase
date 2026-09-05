import { buildConfig } from 'payload';
import { slateEditor } from '@payloadcms/richtext-slate';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { Equipment } from './src/collections/Equipment';
import { Brand } from './src/collections/Brand';
import { Category } from './src/collections/Category';
import { Article } from './src/collections/Article';
import { Material } from './src/collections/Material';
import { HardcaseTemplate } from './src/collections/HardcaseTemplate';
import { Media } from './src/collections/Media';

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-in-production',
  serverURL: 'http://localhost:3000',
  admin: {
    user: 'admin',
    meta: {
      titleSuffix: '- Pembuat Hardcase',
    },
  },
  collections: [Brand, Category, Material, Media, Article, Equipment, HardcaseTemplate],
  editor: slateEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || 'postgres://payload:payload@localhost:5433/payload',
    },
  }),
});
