// The blog's Strapi addresses (server only). Kept apart from lib/strapi.js so auth.js can use them too.
const pick = (value, fallback) =>
  typeof value === 'string' && value.trim() ? value.trim().replace(/\/+$/, '') : fallback

// e.g. http://localhost:1339/api (dev), http://tbblog-strapi:1339/api (container)
export const STRAPI_URL = pick(process.env.STRAPI_URL, 'http://localhost:1339/api')

// Address the browser uses for uploaded images (/uploads/...). Defaults to STRAPI_URL without /api.
export const STRAPI_MEDIA_URL = pick(process.env.STRAPI_MEDIA_URL, STRAPI_URL.replace(/\/api$/, ''))
