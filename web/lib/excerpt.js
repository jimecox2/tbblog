// Plain-text excerpt of an article's markdown body for list cards: markdown is rendered, tags are dropped,
// entities decoded and white space collapsed, then the text is cut at a word near `max` characters.
import { marked } from 'marked'

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", nbsp: ' ' }

export function plainText(markdown) {
  const html = marked.parse(String(markdown || ''), { gfm: true })
  return html
    .replace(/<img[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, e) => ENTITIES[e])
    .replace(/\s+/g, ' ')
    .trim()
}

export function excerpt(markdown, max = 500) {
  const text = plainText(markdown)
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const space = cut.lastIndexOf(' ')
  return `${(space > max * 0.8 ? cut.slice(0, space) : cut).replace(/[\s.,;:!?-]+$/, '')}…`
}
