// /editor — every article (drafts too) for Content Editors: Edit on the left, Create and Delete at the top.
import ArticleTable from '@/components/editor/ArticleTable'
import { listAllArticles } from '@/lib/editor'

export const metadata = { title: 'Articles', robots: { index: false } }

export default async function EditorPage() {
  const articles = await listAllArticles()
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-tbBlue">Articles</h1>
      <ArticleTable articles={articles} />
    </div>
  )
}
