import express from 'express';
import payload from 'payload';
import path from 'path';

const app = express();
const PORT = 3001;

async function start() {
  // Initialize Payload
  await payload.init({
    email: { fromAddress: 'admin@localhost', fromName: 'Pembuat Hardcase' },
    express: app,
    onInit: async (collections) => {
      console.log(`Payload initialized — ${Object.keys(collections).length} collections`);
    },
    secret: process.env.PAYLOAD_SECRET || 'dev-secret',
    db: {
      connectionString: process.env.DATABASE_URL || 'postgres://payload:payload@localhost:5433/payload',
    },
  });

  // Serve Payload admin static files
  app.use('/admin', express.static(path.join(__dirname, '../node_modules/payload/admin')));

  // Start server
  app.listen(PORT, () => {
    console.log(`Payload Admin: http://localhost:${PORT}/admin`);
    console.log(`Payload API: http://localhost:${PORT}/api`);
  });
}

start().catch(console.error);
