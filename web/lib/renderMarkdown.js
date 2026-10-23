// lib/renderMarkdown.js — article markdown -> HTML, server side, no DOM (rule from helpapp's renderGuide.js).
// Raw HTML in the markdown is shown as text, and only http(s), mailto, relative and #anchor URLs are kept.
// Images uploaded to Strapi (/uploads/...) load through this site unless STRAPI_MEDIA_URL is set.
import { Marked } from 'marked'
import { STRAPI_MEDIA_URL } from '@/lib/strapiUrl'

const escapeHtml = s =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const SAFE_URL = /^(https?:|mailto:|\/|#|\.{0,2}\/)/i

function safeUrl(href) {
  const h = String(href || '').trim()
  return SAFE_URL.test(h) ? h : '#'
}

const marked = new Marked({
  gfm: true,
  renderer: {
    html({ text }) {
      return escapeHtml(text)
    },
    link({ href, title, tokens }) {
      const url = safeUrl(href)
      const attrs = /^https?:/i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : ''
      const tt = title ? ` title="${escapeHtml(title)}"` : ''
      return `<a href="${escapeHtml(url)}"${tt}${attrs}>${this.parser.parseInline(tokens)}</a>`
    },
    image({ href, title, text }) {
      let url = safeUrl(href)
      if (STRAPI_MEDIA_URL && url.startsWith('/uploads/')) url = `${STRAPI_MEDIA_URL}${url}`
      const tt = title ? ` title="${escapeHtml(title)}"` : ''
      return `<img src="${escapeHtml(url)}" alt="${escapeHtml(text)}"${tt} loading="lazy">`
    },
  },
})

export function renderMarkdown(markdown) {
  return marked.parse(markdown || '')
}
