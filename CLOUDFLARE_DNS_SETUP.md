=== CLOUDFLARE / DNS SETUP (MANUAL - WHEN READY) ===

Domain: www.pembuathardcase.com
Apex: pembuathardcase.com (redirect to www)

Steps (require manual authorization / Cloudflare dashboard access):

1. Log into Cloudflare account that manages pembuathardcase.com
2. Add A record:
   - Type: A
   - Name: www
   - Content: <VPS_PUBLIC_IP>
   - Proxy status: Proxied (orange cloud)
3. Add redirect (optional):
   - Type: CNAME (apex) or Page Rule redirect
   - From: pembuathardcase.com
   - To: https://www.pembuathardcase.com (301)
4. SSL/TLS:
   - SSL mode: Full (Strict) — requires origin cert or Cloudflare Origin CA
5. Verify Nginx responds to server_name www.pembuathardcase.com
6. Update .env.production with NEXT_PUBLIC_APP_URL=https://www.pembuathardcase.com

No Cloudflare credentials (API token, CLI, .netrc) available in this VPS.
No cloudflared binary installed.
No manual DNS change performed (per instructions: don't change DNS without auth).
