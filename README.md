# Pembuat Hardcase

Database peralatan musik dan rekomendasi hardcase — Next.js 15 + PostgreSQL 16 (Docker) + dynamic frontend.

## Stack

| Komponen | Versi |
|---|---|
| Node.js | 20.19.0 LTS |
| Next.js | 15.1.6 (App Router) |
| PostgreSQL | 16-alpine (Docker, port 5433) |
| Database client | `pg` (Node built-in) |
| TypeScript | 5.9.3 |

## Arsitektur

- **Frontend** Next.js 15 App Router — semua halaman (home, equipment, articles, search) fetch langsung dari PostgreSQL via Next.js API routes.
- **Database** PostgreSQL 16 Docker container, port 5433 (isolated, tidak bentrok dengan host port 5432).
- **API** Internal Next.js API route (`/api/db?table=...`) untuk dynamic queries.

## Setup

### 1. PostgreSQL (Docker)

```bash
sudo docker run -d --name ph-postgres \
  -e POSTGRES_USER=payload \
  -e POSTGRES_PASSWORD=payload \
  -e POSTGRES_DB=payload \
  -p 5433:5432 \
  -v pgdata_hardcase:/var/lib/postgresql/data \
  postgres:16-alpine
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment

File `.env` (tidak boleh di-commit):

```
DATABASE_URL=postgres://payload:payload@localhost:5433/payload
PAYLOAD_SECRET=dev-secret-change-in-production
```

### 4. Schema & seed

```bash
sudo docker exec -i ph-postgres psql -U payload -d payload < seed/equipment_seed.sql
```

### 5. Run

```bash
export DATABASE_URL=postgres://payload:payload@localhost:5433/payload
export PAYLOAD_SECRET=dev-secret-change-in-production
npm run dev
```

Akses:
- Frontend: http://localhost:3000
- DB API: http://localhost:3000/api/db?table=equipment
- PostgreSQL: `localhost:5433` (user: `payload`, db: `payload`)

## Database Schema

Tabel minimal:
- `equipment` (id, brand, modelname, category, weight_kg, casetype, dimensions jsonb, notes)
- `articles` (id, title, slug, excerpt, content, category, created_at)
- `brands` (nama, description)
- `categories` (nama, slug)
- `materials` (nama, description)
- `hardcase_templates` (template config)

Lihat `seed/` untuk reference data.

## Routes

- `/` — Homepage (brand, kategori, equipment terbaru)
- `/equipment` — Listing
- `/equipment/[slug]` — Detail
- `/articles` — Listing
- `/artikel/[slug]` — Detail
- `/search?q=...` — Search across equipment & articles
- `/brands` — Brand listing
- `/kategori/[slug]` — Category
- `/api/db?table=...` — Dynamic DB query API
- `/sitemap.xml` — SEO sitemap
- `/robots.txt` — Robots

## Build Production

```bash
npm run build
npm run start
```

## Backup

Lihat `backup.md`.

## GitHub

Repository ini siap di-push. Remote belum dikonfigurasi — membutuhkan user credentials. Untuk push:

```bash
git remote add origin git@github.com:USER/pembuat-hardcase.git
git push -u origin master
```

## Lisensi

MIT
