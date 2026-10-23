'use server'

import { revalidateTag } from 'next/cache'
import { deleteArticle } from '@/lib/editor'
import { ARTICLES_TAG } from '@/lib/strapi'

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
