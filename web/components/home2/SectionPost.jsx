// A /home2 post, styled after github.blog's section posts with no images: category label, title,
// excerpt, then author and date. `featured` is the large first post of a section.
import Link from 'next/link'
import { formatDate } from '@/lib/format'

export default function SectionPost({ post, featured = false, dark = false }) {
  const muted = dark ? 'text-gray-300' : 'text-gray-600'
  return (
    <article className="flex flex-col">
      <p className={`text-xs font-semibold uppercase tracking-wide ${dark ? 'text-blue-300' : 'text-tbBlue2'}`}>{post.category || 'Common'}</p>
      <h3 className={`mt-2 font-bold leading-snug ${featured ? 'text-2xl sm:text-3xl' : 'text-lg'}`}>
        <Link href={post.href} className={dark ? 'hover:text-blue-300' : 'hover:text-tbBlue'}>{post.title}</Link>
      </h3>
      {post.summary && <p className={`mt-3 leading-relaxed ${featured ? 'text-base' : 'text-sm'} ${muted}`}>{post.summary}</p>}
      <p className={`mt-3 text-sm ${muted}`}>
        {post.authorName && <span className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{post.authorName}</span>}
        {post.authorName && <span aria-hidden="true"> · </span>}
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      </p>
    </article>
  )
}
