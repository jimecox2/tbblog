// A post card, laid out like the PMI blog's: category label, title, bold date, a plain-text excerpt
// of the body, and Read Post. No images. Takes a prepared post ({ id, href, title, category, publishedAt,
// summary }) so it can render inside the topic tabs (a client component).
import Link from 'next/link'
import { formatDate } from '@/lib/format'

export function CategoryBadge({ category }) {
  if (!category) return null
  return <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-tbBlue">{category}</span>
}

// Soft, rounded, airy (after pmi.org/blog): the whole card is the link and lifts on hover.
export default function PostCard({ post, wide = false }) {
  return (
    <Link
      href={post.href}
      className="group flex h-full flex-col rounded-2xl bg-white p-7 shadow-[0_2px_12px_rgba(16,24,64,0.06)] ring-1 ring-black/[0.03] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(16,24,64,0.12)]"
    >
      <span className="self-start rounded-full bg-tbBlue/[0.07] px-3 py-1 text-xs font-semibold text-tbBlue">{post.category || 'Common'}</span>
      <h3 className={`mt-4 font-semibold leading-snug tracking-tight text-gray-900 transition-colors group-hover:text-tbBlue ${wide ? 'text-2xl' : 'text-xl'}`}>
        {post.title}
      </h3>
      <p className="mt-3 text-sm font-semibold text-gray-900">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      </p>
      {post.summary && <p className="mt-3 line-clamp-4 flex-1 text-[15px] leading-relaxed text-gray-600">{post.summary}</p>}
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-tbBlue">
        Read Post
        <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </span>
    </Link>
  )
}
