// "/posts" — every post, 20 a page. Filters (title/description text, category) and the sort are a plain
// GET form, so the URL holds them: /posts?q=agile&category=Timebars&sort=category&page=2
import Link from 'next/link'
import { PostGrid } from '@/components/PostCard'
import { getArticles } from '@/lib/strapi'
import { CATEGORIES } from '@/lib/categories'

export const metadata = { title: 'All Posts' }

export default async function PostsPage({ searchParams }) {
  const q = String(searchParams.q || '').trim()
  const category = CATEGORIES.includes(searchParams.category) ? searchParams.category : ''
  const sort = searchParams.sort === 'category' ? 'category' : 'date'
  const page = Math.max(1, parseInt(searchParams.page, 10) || 1)

  const { articles, pagination } = await getArticles({ q, category, sort, page })
  const pageHref = p => `/posts?${new URLSearchParams({ ...(q && { q }), ...(category && { category }), ...(sort !== 'date' && { sort }), page: String(p) })}`

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-tbBlue">All Posts</h1>

      <form action="/posts" className="mt-6 grid grid-cols-1 gap-3 rounded-lg bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto_auto_auto]">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search titles and descriptions"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-tbBlue2 focus:outline-none"
        />
        <select name="category" defaultValue={category} className="rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option value="">All categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="sort" defaultValue={sort} className="rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option value="date">Newest first</option>
          <option value="category">By category</option>
        </select>
        <div className="flex gap-2">
          <button type="submit" className="rounded-md bg-tbBlue px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">Filter</button>
          {(q || category || sort !== 'date') && (
            <Link href="/posts" className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Clear</Link>
          )}
        </div>
      </form>

      <p className="mt-6 text-sm text-gray-500">
        {pagination.total} {pagination.total === 1 ? 'post' : 'posts'}
        {pagination.pageCount > 1 && ` · page ${pagination.page} of ${pagination.pageCount}`}
      </p>

      <div className="mt-4">
        {articles.length ? <PostGrid articles={articles} /> : <p className="text-gray-500">No posts match.</p>}
      </div>

      {pagination.pageCount > 1 && (
        <nav className="mt-10 flex items-center justify-between" aria-label="Pages">
          {page > 1 ? (
            <Link href={pageHref(page - 1)} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50">← Previous</Link>
          ) : <span />}
          {page < pagination.pageCount ? (
            <Link href={pageHref(page + 1)} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50">Next →</Link>
          ) : <span />}
        </nav>
      )}
    </div>
  )
}
