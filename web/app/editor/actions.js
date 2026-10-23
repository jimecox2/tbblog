'use server'

import { revalidateTag } from 'next/cache'
import { deleteArticle, saveArticle as save } from '@/lib/editor'
import { ARTICLES_TAG } from '@/lib/strapi'
import { CATEGORIES } from '@/lib/categories'
import { slugify } from '@/lib/slug'

// Deletes the chosen articles. Returns { ok, error } for the table to show.
export async function deleteArticles(documentIds) {
  try {
    for (const id of documentIds) await deleteArticle(id)
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e.message }
  } finally {
    revalidateTag(ARTICLES_TAG)
  }
}

// Saves the editor form. publish = true publishes it too. Returns { ok, documentId } or { ok: false, error }.
export async function saveArticle(documentId, fields, publish) {
  const title = String(fields.title || '').trim()
  if (!title) return { ok: false, error: 'A title is needed.' }
  if (!CATEGORIES.includes(fields.category)) return { ok: false, error: 'Choose a category.' }
  const clean = {
    title,
    slug: slugify(fields.slug || title),
    description: String(fields.description || '').trim(),
    category: fields.category,
    authorName: String(fields.authorName || '').trim(),
    body: String(fields.body || ''),
  }
  try {
    const saved = await save(documentId, clean, publish)
    return { ok: true, documentId: saved.documentId, slug: saved.slug }
  } catch (e) {
    const error = /unique/i.test(e.message) ? 'Another article already uses this slug. Change the slug.' : e.message
    return { ok: false, error }
  } finally {
    if (publish) revalidateTag(ARTICLES_TAG)
  }
}
