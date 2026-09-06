# OpenNext / Cloudflare Workers — Configuration Notes

ARCHITECTURE REALITY CHECK:
- Project uses Next.js 15 + Payload CMS + PostgreSQL (TCP connection required)
- Cloudflare Workers = V8 isolate (no persistent TCP, no file-system writes for media, no Node.js server mode)
- Payload Admin + DB adapter requires a persistent server process with access to PostgreSQL
- Therefore: deployment to Cloudflare Workers/Pages will FAIL at runtime for Payload DB access
- Recommended production target: VPS with Docker Compose (current setup) OR Pages with separate DB proxy via Durable Objects / external DB connector

WRANGLER.JSONC PURPOSE:
- Explicit configuration for Cloudflare build-only verification
- Uses @opennextjs/cloudflare build adapter for static + dynamic routes
- Does NOT claim full Payload runtime compatibility

BUILD PROCESS (reproducible):
pnpm install --frozen-lockfile
pnpm add -D wrangler @opennextjs/cloudflare @cloudflare/workers-types
pnpm run build
npx wrangler deploy (after Cloudflare auth + domain DNS configured)

If deploying to Cloudflare, prefer:
- Pages (static) with separate serverless DB proxy, OR
- Keep current VPS production (recommended for Payload + PostgreSQL)

DO NOT change VPS production to Workers without architecture review.
