# tbblog web

Next.js 14 blog (App Router, Tailwind, theme and nav from helpapp). Node 22.

## Run in dev

1. Start Strapi first (`../strapi`, port 1339).
2. `cp .env.example .env.local`, then `npm install` and `npm run dev` → http://localhost:3011

## Build and deploy

`./deploy-push-to-hub-secure.sh` → `jimecox807/tbblog-web:<date tag>` and `:latest`. Container port 3011.

## Publishing refresh

Pages read Strapi through Next's data cache (tag `articles`, at most 1 hour old). To show a change at once, add a
webhook in Strapi: Settings → Webhooks → Create.

- URL: `http://localhost:3011/api/revalidate` in dev (the blog's address on the server)
- Header: `Authorization` = `Bearer <REVALIDATE_SECRET from .env.local>`
- Events: Entry publish, unpublish, update, delete
