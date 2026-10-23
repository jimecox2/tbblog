// "/posts/<slug>" — one post, read only: title, category, author, date published, then the body.
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CategoryBadge } from '@/components/PostCard'
import { getArticle } from '@/lib/strapi'
import { renderMarkdown } from '@/lib/renderMarkdown'
import { formatDate } from '@/lib/format'

export async function generateMetadata({ params }) {
  const article = await getArticle(decodeURIComponent(params.slug))
  if (!article) return {}
  return { title: article.title, description: article.description || undefined }
}

export default async function PostPage({ params }) {
  const article = await getArticle(decodeURIComponent(params.slug))
  if (!article) notFound()

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/posts" className="text-sm text-tbBlue2 hover:underline">← All Posts</Link>
      <header className="mt-6 border-b border-gray-200 pb-6">
        <CategoryBadge category={article.category} />
        <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">{article.title}</h1>
        <p className="mt-3 text-sm text-gray-500">
          {article.authorName && <>By <span className="font-medium text-gray-700">{article.authorName}</span> · </>}
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        </p>
      </header>
      <div
        className="prose prose-lg mt-8 max-w-none prose-a:text-tbBlue2 prose-headings:text-gray-900"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(article.body) }}
      />
    </article>
  )
}
