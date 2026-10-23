// /editor/new — a new article.
import Link from 'next/link'
import { auth } from '@/auth'
import ArticleForm from '@/components/editor/ArticleForm'

export const metadata = { title: 'New article', robots: { index: false } }

export default async function NewArticlePage() {
  const session = await auth()
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/editor" className="text-sm text-tbBlue2 hover:underline">← Articles</Link>
      <h1 className="mt-4 text-3xl font-bold text-tbBlue">New article</h1>
      <ArticleForm defaultAuthor={session?.user?.name} />
    </div>
  )
}
