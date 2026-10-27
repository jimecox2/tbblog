// The All Posts search (title/description text) and category filter, and Previous/Next paging. They are a
// plain GET form and links, so the URL holds the state: <basePath>?q=agile&category=Timebars&page=2
import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'

// The filter values from a page's searchParams, checked.
export function readFilters(searchParams) {
  return {
    q: String(searchParams.q || '').trim(),
    category: CATEGORIES.includes(searchParams.category) ? searchParams.category : '',
    page: Math.max(1, parseInt(searchParams.page, 10) || 1),
  }
}

export function PostFilterForm({ basePath, q, category }) {
  return (
    <form action={basePath} className="flex flex-wrap gap-3 rounded-lg bg-gradient-to-b from-[#eef1fb] via-[#f5f6fc] to-white p-4 shadow-sm">
      <input
        type="search"
        name="q"
        defaultValue={q}
        placeholder="Search titles and descriptions"
        className="min-w-0 flex-1 basis-56 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-tbBlue2 focus:outline-none"
      />
      <select name="category" defaultValue={category} className="rounded-md border border-gray-300 px-3 py-2 text-sm">
        <option value="">All categories</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <div className="flex gap-2">
        <button type="submit" className="rounded-md bg-tbBlue px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">Filter</button>
        {(q || category) && (
          <Link href={basePath} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Clear</Link>
        )}
      </div>
    </form>
  )
}

export function PostPager({ basePath, q, category, page, pageCount }) {
  if (pageCount <= 1) return null
  const pageHref = p => `${basePath}?${new URLSearchParams({ ...(q && { q }), ...(category && { category }), page: String(p) })}`
  return (
    <nav className="mt-10 flex items-center justify-between" aria-label="Pages">
      {page > 1 ? (
        <Link href={pageHref(page - 1)} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50">← Previous</Link>
      ) : <span />}
      {page < pageCount ? (
        <Link href={pageHref(page + 1)} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50">Next →</Link>
      ) : <span />}
    </nav>
  )
}
