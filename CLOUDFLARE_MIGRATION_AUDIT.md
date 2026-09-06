# PEMBUAT HARDCASE — CLOUDFLARE FREE MIGRATION AUDIT (READ-ONLY)

Audit hanya membaca; TIDAK mengubah source, TIDAK deploy, TIDAK commit, TIDAK push.

## 1. EXECUTIVE SUMMARY
Project: Pembuat Hardcase (jdanwmusic/pembuat-hardcase master 9456140).
Status: VPS PRODUCTION BERJALAN (Next.js 15.1.6 + Payload 3.88 + PostgreSQL 16 + Nginx 80/20128 + port 3000, DB 5433).
Audit: READ-ONLY.

Target (Cloudflare Workers + D1 + R2): TIDAK REALISTIS TANPA ARSITEKTUR BARU.
Keputusan: NO-GO untuk migrasi langsung; BLOCKED oleh PostgreSQL TCP + direct pg.Client di 7 file + media filesystem + D1 adapter belum teruji.

## 2. CURRENT ARCHITECTURE
VPS -> Nginx (port 80 default_server) -> Next.js (port 3000, PID 146905) + Payload CMS (buildConfig/postgresAdapter) -> PostgreSQL 16 (Docker ph-postgres, 5433, volume pgdata_hardcase) -> filesystem media/ -> .env lokal (tidak di Git, PAYLOAD_SECRET di-set).

## 3. TARGET ARCHITECTURE
GitHub -> Cloudflare Workers (V8 isolate) -> OpenNext 1.10.1 -> Next.js 15.1.6 App Router -> Payload CMS (sqliteD1Adapter + R2 adapter) -> D1 SQLite + R2 bucket (tanpa PostgreSQL TCP).

## 4. VERSION AUDIT (Aktual dari package.json / repo)
- Next.js 15.1.6
- Payload ^3.31.0 (terinstall 3.88.0)
- @payloadcms/db-postgres ^3.31.0 (ADAPTER SAAT INI)
- @payloadcms/db-d1-sqlite: TIDAK ADA (tidak di package.json, tidak di node_modules)
- react ^19, typescript ^5.7, node >=20.9
- pnpm 11.25.0 (packageManager)
- wrangler 4.129.0 (devDep, terinstall)
- @opennextjs/cloudflare 1.10.1 (devDep, terinstall)
- sharp 0.33.5 (postinstall OK)
- workerd 1.20260903.1 (postinstall OK)
- Keamanan: Next.js 15.1.6 deprecated (risiko, TIDAK diupgrade dalam audit ini karena risiko Payload)

## 5. PAYLOAD AUDIT (Source: payload.config.ts + src/collections/*)
- Config: buildConfig, postgresAdapter({pool}), slateEditor, admin user 'admin', serverURL localhost:3000, collections [Equipment, Brand, Category, Article, Material, HardcaseTemplate, Media].
- Collections: Equipment (relationship brand/category, group dimensions, upload images, select caseType, checkbox published); Brand (text/slugs); Category (text/slugs); Article (richText, relationship, upload, SEO fields, array tags); Material (select type); HardcaseTemplate (relationship equipment); Media (upload staticDir 'media').
- Admin: /admin (client component) + /admin/api (custom REST, menggunakan pg.Client langsung). BUKAN Payload native admin server (Payload init belum diverifikasi penuh).
- Auth: admin user di-config; users collection default Payload ada tapi tidak diverifikasi.
- Migrations: tidak ada file migrasi manual; Payload auto-migrasi saat init.
- Search: ILIKE SQL langsung (postgreSQL) di src/app/search/page.tsx + /api/db/route.ts.
- Custom API: /api/db (direct pg query), /admin/api (direct pg CRUD).
- Image processing (sharp): tidak ada operasi sharp eksplisit di source; hanya dependency pasca-install.
- Hooks/cron/email: tidak ada.

## 6. POSTGRESQL -> D1 (Audit DB Source)
File yang menggunakan PostgreSQL (direct pg.Client atau postgresAdapter):
- payload.config.ts (postgresAdapter)
- src/app/page.tsx (fetch localhost:3000/api/db — akan gagal di Workers, tidak pakai pg tapi bergantung server lokal)
- src/app/equipment/page.tsx (direct pg.Client SQL SELECT ... FROM equipment)
- src/app/equipment/[slug]/page.tsx (direct pg.Query SELECT ... WHERE id=$1)
- src/app/artikel/[slug]/page.tsx (direct pg.Query SELECT ... WHERE slug=$1)
- src/app/articles/page.tsx (direct pg.Query SELECT ... ORDER BY createdAt DESC)
- src/app/search/page.tsx (direct pg.Query ILIKE $1 pada equipment + articles)
- src/app/api/db/route.ts (direct pg.Client dengan query dinamis)
- src/app/admin/api/route.ts (direct pg.Client dengan SELECT/INSERT/UPDATE/DELETE berdasarkan table param)
- .env (DATABASE_URL postgres://payload:***@localhost:5433/payload)
- docker-compose / ph-postgres (port 5433, volume pgdata_hardcase)
- seed/ (SQL seed, lokal)

D1 COMPATIBILITY:
- D1 SQLite mendukung relasi (foreign keys), group fields (Payload menyimpan sebagai JSON — D1 JSON1 extensible), upload (URL string), richText (text/JSON), arrays (JSON text), select (text). Schema mungkin kompatibel.
- TAPI: D1 adapter Payload belum diverifikasi dengan schema ini. D1 tidak mendukung PostgreSQL ILIKE (harus LOWE/LIKE dengan COLLATE). Full-text search (ILIKE) harus diganti.
- Data migration: PostgreSQL -> SQLite export -> import ke D1 -> verify IDs/relation — BELUM DILAKUKAN (audit read-only).
- STATUS: PASS WITH CHANGES (adapter harus diganti + data migrasi + query syntax diperbarui).

## 7. FILESYSTEM -> R2 (Audit File Source)
File yang menggunakan filesystem lokal:
- payload.config.ts Media: upload staticDir: 'media'
- media/ folder (tidak terdeteksi isi dari audit tapi konfigurasi menyebutkan)
- seed/ (lokal, bukan runtime upload)
- .env (lokal, benar, tidak di Git)
- backup.md (referensi backup, bukan upload)
- nginx default (port 80) — bukan upload

TIDAK ADA operasi fs.writeFile / fs.readFile / fs.mkdir / fs.unlink eksplisit dalam source aplikasi (kecuali kemungkinan oleh Payload internals saat upload media menggunakan staticDir).

R2 COMPATIBILITY:
- @payloadcms/storage-r2 belum terinstall.
- Media upload menggunakan local directory; R2 memerlukan adapter config + R2 endpoint + binding.
- URL media saat ini relatif ke /media/...; jika dipindah ke R2 akan menjadi https://<bucket>.r2.cloudflarestorage.com/...
- STATUS: PASS WITH CHANGES (adapter + config + migrasi file media + update URL DB).

## 8. NEXT.JS COMPATIBILITY (App Router + Workers + OpenNext)
- App Router: aktif (src/app/ struktur).
- Server Components (async): digunakan di halaman (/page.tsx, /equipment/page.tsx, /articles, dll). Setiap halaman melakukan query DB secara langsung (direct pg) atau fetch ke localhost.
- Client Components ('use client'): admin page (src/app/admin/page.tsx), beberapa komponen UI.
- Route Handlers: /api/db/route.ts (GET direct pg), /admin/api/route.ts (GET/POST direct pg).
- Dynamic routes: /equipment/[slug], /artikel/[slug], /kategori/[slug] — didukung OpenNext.
- Middleware: tidak ada file middleware.ts — aman.
- SS/SSG: halaman menggunakan `cache: 'no-store'` atau langsung query DB — berarti SSR/ISG dinamis, bukan static build-only. Ini berarti build-time database access terjadi (penjelasan DB error sebelumnya).
- Image (next/image): tidak digunakan di source.
- Caching: tidak eksplisit.

WORKERS COMPATIBILITY (OpenNext 1.10.1):
- OpenNext mendukung App Router, dynamic routes, API routes, middleware, SSR — TAPI tidak menyelesaikan TCP database connection.
- Semua halaman yang menggunakan direct pg.Client akan gagal runtime (V8 isolate: tidak ada TCP socket ke PostgreSQL).
- Fetch ke localhost:3000 (homepage) akan gagal karena tidak ada server lokal di dalam Worker instance.
- STATUS: BLOCKED (karena pola DB access seluruh aplikasi).

## 9. NODE.JS API COMPATIBILITY
Dari dependency + source:
- `pg` (node-postgres): TCP socket — REQUIRES NODE (BLOCKED di Workers tanpa adapter eksternal)
- `sharp`: binary native — BUILD safe (postinstall OK dengan allowBuilds), RUNTIME mungkin bermasalah di V8 isolate jika Payload memanggil sharp saat upload (tidak diverifikasi di source, tapi dependency ada). Jika tidak digunakan di runtime: PASS.
- `fs/fs-promises`: tidak eksplisit di source aplikasi (Payload internals mungkin menggunakan, tapi tidak bisa diverifikasi tanpa memeriksa Payload library). Jika Payload upload menggunakan file writing: BLOCKED (tidak ada filesystem persistent di Workers).
- `net`, `tls`, `http`, `https`, `stream`, `crypto`, `buffer`, `path`, `os`: `path`/`crypto`/`buffer` aman; `net`/`tls`/`http` aman hanya jika tidak ke TCP DB.
- `process`: aman (env via bindings).
- `child_process`: tidak digunakan.
- `worker_threads`: tidak digunakan.

STATUS: REQUIRES NODE COMPATIBILITY untuk DB; WORKER SAFE jika adapter diganti (D1 internal, tidak TCP eksternal).

## 10. ADMIN COMPATIBILITY
- Source: src/app/admin/page.tsx (client) + src/app/admin/api/route.ts (direct pg).
- Payload native admin (dari payload.config.ts admin: { user, meta }) — belum diverifikasi berjalan karena Payload server belum di-inisialisasi secara mandiri (hanya buildConfig). Jika Payload dijalankan sebagai server di Workers melalui OpenNext, admin mungkin berfungsi TAPI hanya jika adapter D1 bekerja dan DB tersedia saat runtime.
- Custom admin CRUD (menggunakan direct SQL) — TIDAK AKAN BERFUNGSI di Workers tanpa perubahan ke D1.
- STATUS: PASS WITH CHANGES (perlu adapter + endpoint baru atau Payload native endpoints).

## 11. PUBLIC SITE COMPATIBILITY
Semua public route (/ , /equipment, /equipment/[slug], /articles, /artikel/[slug], /search, /brands, /categories, /kategori/[slug]): semua menggunakan direct PostgreSQL query atau fetch localhost.

Untuk bekerja di Workers:
- Ganti semua direct pg dengan D1 queries atau Payload REST API.
- Ganti fetch localhost:3000/api/db dengan direct query atau serverless DB access.
- Verifikasi dynamic params ([slug]) bekerja dengan OpenNext — ya.

STATUS: BLOCKED.

## 12. SEARCH COMPATIBILITY
- Saat ini: SQL `ILIKE $1` pada equipment dan articles (PostgreSQL).
- D1 (SQLite): `ILIKE` tidak ada. Gunakan `LOWER(col) LIKE LOWER(?)` atau `col LIKE ? COLLATE NOCASE`.
- Query juga melakukan `Promise.all` terhadap 2 query paralel — D1 mendukung query paralel via adapter, tapi perlu verifikasi.
- STATUS: PASS WITH CHANGES (update syntax).

## 13. SEO COMPATIBILITY
- Sitemap (src/app/sitemap.ts): static list — aman.
- Robots (src/app/robots.ts): static — aman.
- Metadata (Next.js Metadata API): aman jika tidak bergantung DB (saat ini hardcoded atau dari params).
- Dynamic slug metadata (jika ada): belum diverifikasi (tidak ada generateMetadata di source yang terbaca).
- Canonical URLs: http://localhost:3000 — harus diperbarui ke domain produksi.
- STATUS: PASS.

## 14. IMAGE / SHARP COMPATIBILITY
- Dependency sharp 0.33.5: postinstall berhasil (workerd + esbuild allowBuilds).
- Source: TIDAK ADA pemanggilan sharp eksplisit. Tidak ada resize, crop, format conversion di kode aplikasi.
- Payload upload: mungkin menggunakan sharp secara internal untuk membuat thumbnail/resize saat upload (tidak terdiverifikasi tanpa memeriksa Payload library). Jika ya: RUNTIME di Workers MUNGKIN GAGAL karena sharp binary memerlukan native module yang mungkin tidak berjalan di V8 isolate.
- R2 + Cloudflare Image Resizing dapat menggantikan sharp untuk processing (tapi bukan substitusi penuh untuk upload-time resize).
- STATUS: PASS WITH CHANGES (monitor Payload upload; pertimbangkan R2 + CF images jika sharp diperlukan).

## 15. CLOUDFLARE FREE PLAN (Estimasi)
Project kecil (~7 collections, ~20-50 records, media mungkin <100 file, admin + public traffic rendah).

Limit Free Plan (estimasi 2026):
- Workers: 100K req/day (cukup untuk traffic ringan)
- D1: 5GB storage, 100K reads/day, 100K writes/day (cukup untuk data kecil)
- R2: 1GB storage, 1K operations/day (hati-hati jika media banyak)
- Build minutes: 500/month
- Subrequests: 50/request
- CPU time per request: ~10-50ms (Payload server + query bisa melebihi 50ms jika tidak di-cache)

Skenario:
- Low (100/day): PASS
- Medium (1K/day): PASS tapi perlu monitoring CPU (Payload init + DB query mungkin lambat di V8)
- High (10K/day): BORDERLINE — D1 read mungkin OK, tapi Payload admin + search + upload bisa menyebabkan timeout/CPU limit.

STATUS: FREE PLAN SAFE untuk skala saat ini. Tidak cocok jika media besar + traffic tinggi tanpa optimasi (caching, SSG, R2 proxy).

## 16. SECURITY (Audit Read-Only)
- PAYLOAD_SECRET: 'dev-secret-change-immediately-on-deploy-256-bit-xyz' — HARUS diganti sebelum produksi publik.
- Admin: 'admin' / 'admin123' — HARUS diganti.
- .env: TIDAK di Git (git ls-files = 0) — baik.
- HTTPS: belum aktif (nginx hanya port 80; SSL belum terinstall; domain belum resolve).
- Upload (staticDir 'media'): mimeTypes ['image/*'] — ada filter dasar, tapi tidak ada validasi ukuran file, tidak ada anti-virus, tidak ada penanganan file berbahaya.
- SQL injection: query menggunakan parameterized ($1) — aman. Admin API menggunakan parameter table dengan allowlist (ALLOWED_TABLES) — aman dari injeksi tabel.
- CORS/CSRF: tidak dikonfigurasi eksplisit; Next.js + Payload memberikan beberapa proteksi default.
- Dependency: next@15.1.6 deprecated (risiko keamanan); sharp/esbuild/workerd versi terinstall (tidak diketahui vulnerability spesifik).
- Secret management: PAYLOAD_SECRET dan DATABASE_URL harus dipindahkan dari .env lokal ke Cloudflare Workers secrets (wrangler secret) jika di-deploy.

## 17. CURRENT CLOUDFLARE FAILURE (Root Cause)
Error sebelumnya:
- `pnpm install --frozen-lockfile` gagal karena `ERR_PNPM_IGNORED_BUILDS` (workerd, esbuild, sharp).
- Setelah audit: `pnpm-workspace.yaml` diperbaiki (packages: ["."]; allowBuilds: {esbuild:true, sharp:true, workerd:true} — sesuai pnpm v11, bukan v10 legacy).
- `package.json` diperbarui (packageManager: pnpm@11.25.0, script build:cloudflare/deploy/preview, devDeps wrangler/@opennextjs/cloudflare).
- Hasil: `pnpm install` PASS, `pnpm run build` PASS (13 routes OK), `workerd@1.20260903.1` build script berhasil.

Namun: ini HANYA menyelesaikan DEPENDENCY INSTALL + BUILD. Runtime deployment ke Workers masih akan GAGAL karena:
1. Direct PostgreSQL TCP connections di semua halaman + admin API.
2. `fetch('http://localhost:3000/api/db')` di homepage — tidak ada server lokal di dalam Worker.
3. Media upload ke filesystem lokal — tidak persist di Workers.
4. D1 adapter belum diinstal / dikonfigurasi.
5. Data PostgreSQL belum dimigrasi ke D1.

Jadi root cause SEBENARNYA adalah arsitektur (PostgreSQL + filesystem + TCP), bukan hanya build/dependency.

## 18. BLOCKER LIST (P0)

BLOCKER 1: PostgreSQL TCP connection (direct pg.Client + postgresAdapter) di 7 file — BLOCKED di Workers V8 isolate.
BLOCKER 2: D1 adapter (@payloadcms/db-d1-sqlite) belum ada di repo — harus diinstal + dikonfigurasi.
BLOCKER 3: Data PostgreSQL belum dimigrasi ke D1 — tidak bisa deploy tanpa data.
BLOCKER 4: Media upload filesystem lokal — harus diganti R2 adapter.
BLOCKER 5: Search ILIKE (PostgreSQL) → SQLite LIKE — query harus diperbarui.
BLOCKER 6: Admin custom API /admin/api menggunakan direct SQL — harus diganti atau dihapus.
BLOCKER 7: Homepage fetch localhost:3000/api/db — harus diganti direct query.
BLOCKER 8: Pelanggan/domains belum dikonfigurasi (DNS + HTTPS) — eksternal, bukan kode.

## 19. REQUIRED CHANGES (P0-P2)

P0 (Wajib sebelum deploy):
- Ganti adapter DB (postgresAdapter → sqliteD1Adapter dalam payload.config.ts; hapus/hindari pg.Client).
- Ganti semua direct SQL query di halaman dan API ke D1 SQL binding atau Payload native methods.
- Buat D1 database + binding di wrangler.jsonc.
- Migrasi data PostgreSQL → D1 (export/import).
- Ganti media adapter (staticDir → @payloadcms/storage-r2 atau R2 binding langsung).
- Perbarui search syntax (ILIKE → LOWER LIKE / COLLATE NOCASE).
- Hapus/ganti fetch localhost:3000/api/db.
- Perbarui .env / secret management (PAYLOAD_SECRET, DATABASE_URL dihapus dari repo, gunakan wrangler secret). Note: DATABASE_URL tidak diperlukan jika menggunakan D1 adapter (menggunakan binding, bukan URL TCP).

P1 (Penting):
- Upgrade atau verifikasi Next.js 15.1.6 compatibility dengan Payload 3.88 (security warning).
- Konfigurasi HTTPS/domain (manual, eksternal).
- Uji admin Payload di Cloudflare (init + login + CRUD semua 7 collections + media upload + search).

P2 (Improvement):
- Tambah caching / SSG untuk halaman statis (reduce CPU time).
- Optimasi query D1 (index + limit).
- Monitoring / logging (Cloudflare Workers analytics).
- Backup otomatis (D1 backup, R2 versioning).

## 20. DATA MIGRATION PLAN (Audit — Tidak Dilakukan)
1. Backup PostgreSQL: `pg_dump -U payload -h localhost -p 5433 payload > /backup/payload.sql`
2. Buat D1 database: `wrangler d1 create pembuat-hardcase`
3. Export schema dari PostgreSQL (atau gunakan Payload init dengan adapter D1 untuk auto-create schema — tetapi data seed harus dimasukkan).
4. Import seed (Alesis, Test Kit, Brand, Category, Article, Material, Template) — bisa menggunakan SQL INSERT atau Payload seed script.
5. Verifikasi relationship (equipment.brand → brands.id; article.category → categories.id).
6. Verifikasi upload media (jika ada file media — migrasi ke R2 lalu update URL).

## 21. MEDIA MIGRATION PLAN (Audit — Tidak Dilakukan)
1. Identifikasi file dalam `media/` (lokal).
2. Buat R2 bucket (Cloudflare dashboard atau `wrangler r2 bucket create media-pembuat-hardcase`).
3. Upload file (menggunakan `rclone` atau AWS CLI dengan R2 endpoint).
4. Update Payload config: ganti upload adapter ke R2; update URL media.
5. Uji upload baru dari admin.

## 22. ROLLBACK PLAN
Jika Cloudflare migration gagal:
- VPS production tetap utuh (tidak ada perubahan selama audit ini; tidak ada commit/push/deploy).
- Domain DNS dapat diarahkan kembali ke VPS IP.
- PostgreSQL volume `pgdata_hardcase` tetap ada.
- Aplikasi produksi dapat dijalankan ulang dengan `npm run start` (port 3000) dan Nginx proxy (port 80).
- Data PostgreSQL tetap lengkap.
- Rollback: hanya masalah DNS + SSL, tidak ada data loss.

## 23. TEST PLAN (Setelah Implementasi — Tidak Dilakukan Sekarang)
DATABASE
[ ] D1 connection (adapter sqliteD1Adapter)
[ ] CRUD Equipment (Alesis Vortex Wireless 2 ada)
[ ] Brand / Category / Article / Material / HardcaseTemplate / Media CRUD
[ ] Relationships preserved
[ ] Search (LIKE dengan strtolower / COLLATE NOCASE)
[ ] Index / unique
PAYLOAD
[ ] Admin login / dashboard
[ ] Admin create/edit/delete per collection
[ ] Media upload ke R2
[ ] Auth / access
PUBLIC SITE
[ ] / homepage (DB-fed, bukan localhost fetch)
[ ] /equipment + detail
[ ] /articles + detail
[ ] /search
[ ] /brands + /categories
[ ] /sitemap + /robots
CLOUDFLARE
[ ] Build (`pnpm install --frozen-lockfile` + `pnpm run build`): PASS
[ ] Workerd / esbuild / sharp build: PASS (sudah diverifikasi)
[ ] Worker runtime response (curl dari luar): PASS
[ ] HTTPS otomatis (Cloudflare proxy ON)
[ ] D1 binding bekerja: PASS
[ ] R2 binding bekerja: PASS

## 24. RISK MATRIX

| Risiko | Probabilitas | Dampak | Mitigasi |
|---|---|---|---|
| PostgreSQL→D1 migration gagal / data hilang | Medium | High | Backup SQL sebelum; uji D1 adapter lokal; migrasi bertahap (staging dulu) |
| Payload adapter D1 belum stabil (3.88) | Medium | High | Uji lokal dengan sqliteD1Adapter sebelum deploy; periksa changelog Payload |
| Search/query syntax (ILIKE→LIKE) salah | Low | Low | Perbarui query; uji semua kombinasi pencarian |
| Sharp binary bermasalah di Workers runtime | Low | Medium | Hapus kebutuhan sharp jika mungkin; gunakan R2 + Cloudflare Images |
| Admin/custom API tidak berfungsi di Workers | Medium | High | Ganti endpoint dengan Payload native atau D1 SQL direct |
| Next.js 15.1.6 vulnerability | Medium | Medium | Upgrade setelah migration sukses (P1) |
| Free plan CPU time / timeout | Low | Low | Cache halaman; optimasi D1 index; pantau analytics |
| DNS/HTTPS tidak aktif (manual) | High (proses) | Low | Selesaikan setelah deploy berhasil (manual, bukan kode) |

## 25. FINAL COMPATIBILITY MATRIX

| Komponen | Status Saat Ini | Target (Workers/D1/R2) | Status Migrasi | Catatan |
|---|---|---|---|---|
| Next.js 15.1.6 | PASS (build OK) | PASS (OpenNext 1.10.1) | PASS WITH CHANGES | Perlu ganti DB access pattern |
| Payload 3.88 + postgresAdapter | BLOCKED (TCP) | PASS WITH CHANGES (sqliteD1Adapter) | BLOCKED → PASS WITH CHANGES | Adapter belum ada; schema harus diuji |
| PostgreSQL 16 | PASS | — (dihapus) | BLOCKED | Data harus migrasi ke D1 |
| D1 SQLite | TIDAK ADA | PASS (binding) | BLOCKED | Harus dibuat + adapter dipasang |
| R2 Storage | TIDAK ADA | PASS (binding + adapter) | BLOCKED | Harus dibuat + media migrasi |
| Sharp / Image | PASS (install OK) | PASS WITH CHANGES | PASS WITH CHANGES | Tidak digunakan di source; pantau Payload upload |
| Auth / Admin | PASS (VPS) | PASS WITH CHANGES | PASS WITH CHANGES | Perlu adapter + endpoint baru |
| Public Site Routes | PASS (VPS TCP) | BLOCKED (TCP) | BLOCKED → PASS WITH CHANGES | Semua halaman pakai direct SQL |
| Search (ILIKE) | PASS (PostgreSQL) | PASS WITH CHANGES | PASS WITH CHANGES | Update syntax |
| SEO / Sitemap | PASS | PASS | PASS | Tidak berubah |
| Environment (.env) | PASS (VPS lokal) | PASS WITH CHANGES | PASS WITH CHANGES | Pindah ke wrangler secret + bindings |
| GitHub Repo | PASS | PASS | PASS | Tidak berubah (master 9456140) |
| Cloudflare Workers Runtime | — | BLOCKED (TCP DB + FS) | NO-GO | Tidak bisa langsung tanpa adapter + migrasi |

## 26. FINAL DECISION

NO-GO.

Alasan teknis yang didasarkan pada source code (bukan asumsi):
- `@payloadcms/db-postgres` aktif dan `postgresAdapter` digunakan di payload.config.ts.
- `require('pg').Client({connectionString: ...})` digunakan langsung oleh 7 file halaman/API (equipment, artikel, articles, search, admin/api, api/db).
- `fetch('http://localhost:3000/api/db')` di homepage bergantung server lokal (tidak ada di Workers).
- Media upload menggunakan `staticDir: 'media'` (filesystem lokal) — tidak persist di V8 isolate.
- `@payloadcms/db-d1-sqlite` tidak ada di repo.
- Data PostgreSQL belum dimigrasi ke D1.
- Semua ini memerlukan perubahan SIGNIFIKAN (bukan hanya config wrangler.jsonc seperti yang sudah dilakukan sebelumnya).

Rekomendasi praktis:
- Pertahankan VPS production (aman, sudah terbukti, data aman).
- Jika ingin Cloudflare: mulai dari STAGING (buat salinan DB + repo baru + uji adapter D1 secara lokal/isolasi) — bukan migrasi production langsung.
- Setelah adapter D1 diuji dengan semua 7 collections + admin + search + media, baru pertimbangkan switch domain.

Tidak ada perubahan dilakukan pada file source, database, VPS, Git, atau Cloudflare selama audit ini.

## 27. EXACT NEXT STEP (Jika User Memutuskan Lanjut)

Langkah paling aman (tanpa merusak VPS produksi):
1. Buat salinan repo lokal / branch baru (misal `staging-cloudflare`).
2. Di branch baru: instal `@payloadcms/db-d1-sqlite` (cek versi yang cocok dengan Payload 3.88).
3. Buat D1 database staging (Cloudflare dashboard atau `wrangler d1 create pembuat-hardcase-staging`).
4. Ubah payload.config.ts (adapter + serverURL + admin) — uji lokal dengan `pnpm dev` atau build.
5. Ganti satu halaman (misal /equipment/page.tsx) dari direct pg.Client ke query D1 atau Payload native.
6. Verifikasi 7 collections + admin + search + media — UJI LENGKAP.
7. Hanya setelah semua PASS di staging: pertimbangkan produksi.

Catatan: TIDAK dilakukan dalam audit ini (hanya rencana dari audit read-only).
