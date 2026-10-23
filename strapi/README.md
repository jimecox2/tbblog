# tbblog Strapi

Strapi 5 (Community Edition) for the Timebars blog. JavaScript, Postgres, Node 22.

## Run in dev (workstation)

1. On tbpgdb, create the blog's own database and user. Never use tbbe's `strapi` database: Strapi 5 would migrate it.
   ```sql
   CREATE USER tbblog WITH PASSWORD 'strapi2';
   CREATE DATABASE tbblog OWNER tbblog;
   ```
2. `cp .env.example .env`, `chmod 600 .env`, fill in the password and the secrets (`openssl rand -base64 32` each).
3. `npm install`, then `npm run develop` → http://localhost:1339/admin. Create the first admin user there.

Content types made in the admin UI (dev only) are saved under `src/api/`; commit them.

## Build and deploy

`./deploy-push-to-hub-secure.sh` → `jimecox807/tbblog-strapi:<date tag>` and `:latest`. Server files come from tbown,
like the other containers. In a container use `HOST=0.0.0.0`, `DATABASE_HOST=tbpgdb`, `DATABASE_PORT=5432`.
