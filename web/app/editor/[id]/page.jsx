// /editor/<documentId> — edit an article (its latest draft).
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ArticleForm from '@/components/editor/ArticleForm'
import { getArticleDraft } from '@/lib/editor'

export const metadata = { title: 'Edit article', robots: { index: false } }

export default async function EditArticlePage({ params }) {
  const article = await getArticleDraft(params.id).catch(e => {
    if (/not found|404/i.test(e.message)) return null
    throw e
  })
  if (!article) notFound()
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/editor" className="text-sm text-tbBlue2 hover:underline">← Articles</Link>
      <h1 className="mt-4 text-3xl font-bold text-tbBlue">Edit article</h1>
      <ArticleForm article={article} />
    </div>
  )
}
