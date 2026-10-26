// An article cut down to what a list card shows, with the body reduced to a plain-text excerpt of about
// `max` characters here on the server, so full bodies never go to the browser.
import 'server-only'
import { excerpt } from '@/lib/excerpt'
import { articleHref } from '@/lib/strapi'

export const toCardPost = max => a => ({
  id: a.documentId,
  href: articleHref(a),
  title: a.title,
  category: a.category,
  authorName: a.authorName,
  publishedAt: a.publishedAt,
  summary: excerpt(a.body, max),
})
