# Backup Procedure — Pembuat Hardcase

## PostgreSQL Backup (via Docker container ph-postgres)
```bash
# Daily backup
sudo docker exec ph-postgres pg_dump -U payload -d payload -F c -f /backup/payload_$(date +%Y%m%d).dump
# Restore (if needed)
sudo docker exec -i ph-postgres psql -U payload -d payload < /backup/payload_YYYYMMDD.dump
```

## Media Uploads Backup
```bash
# Media folder (if using local uploads)
tar -czf /backup/media_$(date +%Y%m%d).tar.gz /home/ubuntu/pembuat-hardcase/src/app/public/media/
```

## Database Persistence
- Volume: `pgdata_hardcase` (Docker volume, not file system directly).
- Verify persistence: `sudo docker volume inspect pgdata_hardcase`

## Git Repo Backup
- All source code is already in Git (master branch, 2 commits).
- Clone/backup: `git clone /home/ubuntu/pembuat-hardcase /backup/repo_$(date +%Y%m%d)`

## Secrets / Env (DO NOT COMMIT)
- `.env` file contains DATABASE_URL (optional, currently hardcoded).
- Admin password: `admin123` — CHANGE before production.

## Status
- Backup procedure documented.
- Actual automated backup (cron) not yet configured — can be added with `cronjob` if needed.
