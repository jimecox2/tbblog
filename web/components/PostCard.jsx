// One post as a raised card: date and category, title, description, Read more. No images or icons.
import Link from 'next/link'
import { articleHref } from '@/lib/strapi'
import { formatDate } from '@/lib/format'

export function CategoryBadge({ category }) {
  if (!category) return null
  return <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-tbBlue">{category}</span>
}

export default function PostCard({ article }) {
  const href = articleHref(article)
  return (
    <article className="flex flex-col rounded-lg border border-gray-100 bg-white p-6 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        <CategoryBadge category={article.category} />
      </div>
      <h2 className="mt-3 text-lg font-semibold leading-snug text-gray-900">
        <Link href={href} className="hover:text-tbBlue">{article.title}</Link>
      </h2>
      {article.description && <p className="mt-2 line-clamp-3 flex-1 text-sm text-gray-600">{article.description}</p>}
      <Link href={href} className="mt-4 text-sm font-medium text-tbBlue2 hover:underline">
        Read more →
      </Link>
    </article>
  )
}

export function PostGrid({ articles }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map(a => <PostCard key={a.documentId} article={a} />)}
    </div>
  )
}
