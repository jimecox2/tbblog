# Deploying tbblog

Two containers on the shared Docker network `tbnet`, next to `tbpgdb`:

| Container | Image | Port | Who reaches it |
|---|---|---|---|
| `tbblog-strapi` | `jimecox807/tbblog-strapi:<tag>` | 1339 | the blog (over tbnet), and you on the LAN for `/admin` |
| `tbblog-web` | `jimecox807/tbblog-web:<tag>` | 3011 | tbproxy (public blog) |

| Server | Environment | Blog address | LISTEN_IP |
|---|---|---|---|
| gmk1 | PROD | https://blog.agile-pm-rm-ppm.com | 192.168.1.205 |
| lser | STAGING | https://blogs.agile-pm-rm-ppm.com | 192.168.1.9 |

Strapi is never put on the internet. Article images (`/uploads/...`) are served through the blog.

## 1. Build and push (workstation)

```
cd strapi && ./deploy-push-to-hub-secure.sh     # type the tag, e.g. 2026.10.23
cd ../web && ./deploy-push-to-hub-secure.sh     # use the same tag
```

## 2. First install on a server

```
mkdir -p ~/docker/tbApps/tbblog && cd ~/docker/tbApps/tbblog
# copy docker-compose.yml, strapi.env.example, web.env.example from this folder
cp strapi.env.example strapi.env.local && cp web.env.example web.env.local && chmod 600 *.env.local
# fill both files: secrets (openssl rand -base64 32), database password, addresses
printf 'TBBLOG_TAG=2026.10.24\nLISTEN_IP=192.168.1.205\n' > .env     # lser: LISTEN_IP=192.168.1.9
mkdir uploads && sudo chown 1000:1000 uploads      # Strapi runs as user "node" (uid 1000) and writes here
docker compose up -d
```

The database and user must exist on that server's tbpgdb first (step 3 creates them).

Then in Strapi (`http://<server>:1339/admin`), Settings → Webhooks: URL `http://tbblog-web:3011/api/revalidate`,
header `Authorization: Bearer <REVALIDATE_SECRET from web.env.local>`, events Entry publish, unpublish, update, delete.

New version: change `TBBLOG_TAG` in `.env`, then `docker compose pull && docker compose up -d`.

## 3. Copy the content from staging (lser) to production (gmk1)

Both tbpgdb containers listen on `127.0.0.1:5433` on their own server; the commands below use
`docker exec`, so no port is needed. Run them as written; `$POSTGRES_USER` is read inside the container.

**On lser** (staging) – dump the database and pack the uploaded files:

```
docker exec tbpgdb pg_dump -U tbblog -d tbblog -Fc > ~/tbblog.dump
tar czf ~/tbblog-uploads.tgz -C <folder with Strapi's public/uploads> .
scp ~/tbblog.dump ~/tbblog-uploads.tgz jcox@192.168.1.205:~/
```

In dev on lser, Strapi's uploads folder is `tbblog/strapi/public/uploads`.

**On gmk1** (production) – first time only, create the user and database:

```
docker exec -it tbpgdb sh -c 'psql -U "$POSTGRES_USER" -d postgres'
  CREATE USER tbblog WITH PASSWORD '<production password>';
  CREATE DATABASE tbblog OWNER tbblog;
  \q
```

Then load the copy (stop Strapi first; `--clean` replaces what is there):

```
cd ~/docker/tbApps/tbblog && docker compose stop tbblog-strapi
docker exec -i tbpgdb pg_restore -U tbblog -d tbblog --clean --if-exists --no-owner --role=tbblog < ~/tbblog.dump
tar xzf ~/tbblog-uploads.tgz -C ~/docker/tbApps/tbblog/uploads && sudo chown -R 1000:1000 ~/docker/tbApps/tbblog/uploads
docker compose start tbblog-strapi
```

What comes across: articles, Strapi admin users, blog users and roles (Content Editor), permissions, webhooks.
After the copy, check the webhook URL and secret in Strapi's settings match production. API tokens made on
staging do not work on production (its salt differs); make new ones there if you need any.

## 4. Proxy (tbproxy, Caddy on gmk1)

One proxy for the LAN: the router sends ports 80 and 443 to gmk1, where `tbproxy` answers every name and gets the
HTTPS certificates. Its Caddyfile (`~/docker/tbApps/proxy/Caddyfile`, made by tbown) has:

```
blog.agile-pm-rm-ppm.com {          # PROD, same server: over tbnet
	import tb_common
	encode zstd gzip
	reverse_proxy tbblog-web:3011
}

blogs.agile-pm-rm-ppm.com {         # STAGING on lser: over the LAN, to LISTEN_IP
	import tb_staging
	encode zstd gzip
	reverse_proxy 192.168.1.9:3011
}
```

Strapi's port 1339 is in no Caddyfile and is never forwarded on the router, so the admin stays on the LAN.
