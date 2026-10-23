// The blog's Strapi addresses (server only). Kept apart from lib/strapi.js so auth.js can use them too.
const pick = (value, fallback) =>
  typeof value === 'string' && value.trim() ? value.trim().replace(/\/+$/, '') : fallback

// e.g. http://localhost:1339/api (dev), http://tbblog-strapi:1339/api (container)
export const STRAPI_URL = pick(process.env.STRAPI_URL, 'http://localhost:1339/api')

// Strapi itself, without /api: uploaded files are at STRAPI_ORIGIN/uploads/...
export const STRAPI_ORIGIN = STRAPI_URL.replace(/\/api$/, '')

// Where the browser loads uploaded images from. Empty (the default) = this site: /uploads/... is passed on
// to Strapi by app/uploads/[...path]/route.js, so Strapi need not be reachable from the internet.
export const STRAPI_MEDIA_URL = pick(process.env.STRAPI_MEDIA_URL, '')
