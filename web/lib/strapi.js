// lib/strapi.js — reads published articles from the blog's Strapi (server only).
//
// Every read is kept in Next's data cache under the tag "articles" for an hour. When an editor publishes,
// Strapi's webhook calls /api/revalidate, which clears the tag, so the change shows on the next visit
// without a rebuild.
import 'server-only'

const pick = (value, fallback) =>
  typeof value === 'string' && value.trim() ? value.trim().replace(/\/+$/, '') : fallback

// e.g. http://localhost:1339/api (dev), http://tbblog-strapi:1339/api (container)
export const STRAPI_URL = pick(process.env.STRAPI_URL, 'http://localhost:1339/api')

// Address the browser uses for uploaded images (/uploads/...). Defaults to STRAPI_URL without /api.
export const STRAPI_MEDIA_URL = pick(process.env.STRAPI_MEDIA_URL, STRAPI_URL.replace(/\/api$/, ''))

export const PAGE_SIZE = 20
export const ARTICLES_TAG = 'articles'

// What a card needs (no body)
const CARD_FIELDS = ['title', 'slug', 'description', 'category', 'authorName', 'publishedAt']

function query(params) {
  const qs = new URLSearchParams()
  const add = (key, value) => {
    if (value === undefined || value === null || value === '') return
    if (Array.isArray(value)) value.forEach((v, i) => add(`${key}[${i}]`, v))
    else if (typeof value === 'object') Object.entries(value).forEach(([k, v]) => add(`${key}[${k}]`, v))
    else qs.append(key, String(value))
  }
  Object.entries(params).forEach(([k, v]) => add(k, v))
  return qs.toString()
}

async function get(path, params) {
  const res = await fetch(`${STRAPI_URL}${path}?${query(params)}`, {
    cache: 'force-cache',
    next: { tags: [ARTICLES_TAG], revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Strapi ${path} answered ${res.status}`)
  return res.json()
}

// Posts published since the start of the day two months ago, newest first.
export async function getRecentArticles() {
  const since = new Date()
  since.setUTCMonth(since.getUTCMonth() - 2)
  since.setUTCHours(0, 0, 0, 0)
  const { data } = await get('/articles', {
    fields: CARD_FIELDS,
    filters: { publishedAt: { $gte: since.toISOString() } },
    sort: ['publishedAt:desc'],
    pagination: { pageSize: 100 },
  })
  return data
}

// One page of posts. q matches title or description; sort is 'date' (newest first) or 'category'.
export async function getArticles({ q = '', category = '', sort = 'date', page = 1 } = {}) {
  const filters = {}
  if (q) filters.$or = [{ title: { $containsi: q } }, { description: { $containsi: q } }]
  if (category) filters.category = { $eq: category }
  const { data, meta } = await get('/articles', {
    fields: CARD_FIELDS,
    filters,
    sort: sort === 'category' ? ['category:asc', 'publishedAt:desc'] : ['publishedAt:desc'],
    pagination: { page, pageSize: PAGE_SIZE },
  })
  return { articles: data, pagination: meta.pagination }
}

// One post by its slug, or by its documentId when it has no slug. null when not found.
export async function getArticle(slugOrId) {
  const bySlug = await get('/articles', { filters: { slug: { $eq: slugOrId } }, pagination: { pageSize: 1 } })
  if (bySlug.data.length) return bySlug.data[0]
  const byId = await get('/articles', { filters: { documentId: { $eq: slugOrId } }, pagination: { pageSize: 1 } })
  return byId.data[0] || null
}

export const articleHref = article => `/posts/${encodeURIComponent(article.slug || article.documentId)}`
