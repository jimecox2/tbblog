// lib/strapi.js — reads published articles from the blog's Strapi (server only).
//
// Every read is kept in Next's data cache under the tag "articles" for an hour. When an editor publishes,
// Strapi's webhook calls /api/revalidate, which clears the tag, so the change shows on the next visit
// without a rebuild.
import 'server-only'
import { STRAPI_URL } from '@/lib/strapiUrl'

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
    next: { tags: [ARTICLES_TAG], revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Strapi ${path} answered ${res.status}`)
  return res.json()
}

// One page of posts, newest first. q matches title or description.
// withBody adds the markdown body (for cards that show an excerpt of it).
export async function getArticles({ q = '', category = '', page = 1, pageSize = PAGE_SIZE, withBody = false } = {}) {
  const filters = {}
  if (q) filters.$or = [{ title: { $containsi: q } }, { description: { $containsi: q } }]
  if (category) filters.category = { $eq: category }
  const { data, meta } = await get('/articles', {
    fields: withBody ? [...CARD_FIELDS, 'body'] : CARD_FIELDS,
    filters,
    sort: ['publishedAt:desc'],
    pagination: { page, pageSize },
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
