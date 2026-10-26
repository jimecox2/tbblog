// A post card, laid out like the PMI blog's: category label, title, bold date, a plain-text excerpt
// of the body, and Read Post. No images. Takes a prepared post ({ id, href, title, category, publishedAt,
// summary }) so it can render inside the topic tabs (a client component).
import Link from 'next/link'
import { formatDate } from '@/lib/format'

export function CategoryBadge({ category }) {
  if (!category) return null
  return <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-tbBlue">{category}</span>
}

export default function PostCard({ post, wide = false }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-gray-100 bg-white p-6 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl">
      <p className="text-xs font-semibold uppercase tracking-wide text-tbBlue2">{post.category || 'Common'}</p>
      <h3 className={`mt-2 font-semibold leading-snug text-gray-900 ${wide ? 'text-xl' : 'text-lg'}`}>
        <Link href={post.href} className="hover:text-tbBlue">{post.title}</Link>
      </h3>
      <p className="mt-2 text-sm font-bold text-gray-800">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      </p>
      {post.summary && <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{post.summary}</p>}
      <Link href={post.href} className="mt-4 text-sm font-medium text-tbBlue2 hover:underline">
        Read Post →
      </Link>
    </article>
  )
}
