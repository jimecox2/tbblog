// lib/editor.js — Strapi calls for the editor pages, made with the signed-in editor's Strapi token.
// Server only, never cached: editors always see the latest drafts.
import 'server-only'
import { getToken } from 'next-auth/jwt'
import { headers } from 'next/headers'
import { STRAPI_URL } from '@/lib/strapiUrl'
import { auth, SESSION_COOKIE } from '@/auth'

// The editor's Strapi token from the encrypted session cookie, or null when not signed in.
export async function editorToken() {
  const session = await auth()
  if (!session) return null
  const token = await getToken({
    req: { headers: headers() },
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
    cookieName: SESSION_COOKIE,
    salt: SESSION_COOKIE,
  })
  return token?.strapiJwt || null
}

async function call(path, { method = 'GET', body } = {}) {
  const jwt = await editorToken()
  if (!jwt) throw new Error('Please sign in again')
  const res = await fetch(`${STRAPI_URL}${path}`, {
    method,
    headers: { Authorization: `Bearer ${jwt}`, ...(body && { 'Content-Type': 'application/json' }) },
    body: body && JSON.stringify(body),
    cache: 'no-store',
  })
  if (!res.ok) {
    const msg = await res.json().then(j => j?.error?.message, () => null)
    throw new Error(msg || `Strapi answered ${res.status}`)
  }
  return res.status === 204 ? null : res.json()
}

// Every article (draft versions, which every article has), with whether it is published and when.
export async function listAllArticles() {
  const fields = 'fields[0]=title&fields[1]=slug&fields[2]=category&fields[3]=authorName&fields[4]=updatedAt&fields[5]=publishedAt'
  const all = async status => {
    const out = []
    for (let page = 1; ; page++) {
      const { data, meta } = await call(`/articles?status=${status}&${fields}&sort=updatedAt:desc&pagination[page]=${page}&pagination[pageSize]=100`)
      out.push(...data)
      if (page >= meta.pagination.pageCount) return out
    }
  }
  const [drafts, published] = await Promise.all([all('draft'), all('published')])
  const pub = new Map(published.map(a => [a.documentId, a]))
  return drafts.map(d => {
    const p = pub.get(d.documentId)
    return {
      ...d,
      publishedAt: p?.publishedAt || null,
      // Saved since it was last published
      changed: !!p && new Date(d.updatedAt) - new Date(p.updatedAt) > 1000,
    }
  })
}

// Deletes an article and all its versions.
export function deleteArticle(documentId) {
  return call(`/articles/${encodeURIComponent(documentId)}`, { method: 'DELETE' })
}
