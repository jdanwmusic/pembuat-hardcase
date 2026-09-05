import { Config } from 'payload'

export default Config({
  serverURL: 'http://localhost:3000',
  admin: {
    user: 'admin',
    password: 'admin123',
    meta: {
      titleSuffix: '- Pembuat Hardcase',
      favicon: '/favicon.ico',
    },
    // branding
    components: {
      // Logo: () => <svg>...</svg>,
    },
  },
  collections: [],
  editor: slateEditor({}),
  rateLimit: {
    max: 2000,
    timeWindow: 60,
  },
  db: {
    connectionString: process.env.DATABASE_URL || 'postgres://payload:payload@localhost:5432/payload',
  },
})
