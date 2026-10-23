// POST /api/revalidate — called by Strapi's webhook when an article is published, changed or deleted.
// Clears the cached articles so the change shows on the next visit. Strapi sends
// "Authorization: Bearer <REVALIDATE_SECRET>" (a header set on the webhook in Strapi's settings).
import { revalidateTag } from 'next/cache'
import { ARTICLES_TAG } from '@/lib/strapi'

export async function POST(request) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ ok: false }, { status: 401 })
  }
  revalidateTag(ARTICLES_TAG)
  return Response.json({ ok: true })
}
