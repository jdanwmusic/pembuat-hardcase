import { buildConfig } from 'payload';
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite';
import { r2Storage } from '@payloadcms/storage-r2';
import { slateEditor } from '@payloadcms/richtext-slate';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { Equipment } from './src/collections/Equipment';
import { Brand } from './src/collections/Brand';
import { Category } from './src/collections/Category';
import { Article } from './src/collections/Article';
import { Material } from './src/collections/Material';
import { HardcaseTemplate } from './src/collections/HardcaseTemplate';
import { Media } from './src/collections/Media';

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-immediately-on-deploy-256-bit-xyz',
  serverURL: process.env.NEXT_PUBLIC_APP_URL || 'https://www.pembuathardcase.com',
  admin: {
    user: 'admin',
    meta: { titleSuffix: '- Pembuat Hardcase' },
  },
  collections: [Brand, Category, Material, Media, Article, Equipment, HardcaseTemplate],
  editor: slateEditor({}),
  db: sqliteD1Adapter({
    // D1 binding matches Cloudflare environment
    binding: (globalThis as any).env?.D1 || (process as any)?.env?.D1,
  }),
  plugins: [
    r2Storage({
      collections: { media: true },
      bucket: (globalThis as any).env?.R2 || (process as any)?.env?.R2,
    }),
  ],
});
