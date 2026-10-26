// The All Posts filters (title/description text, category, sort) and Previous/Next paging, shared by every
// page that lists posts. They are a plain GET form and links, so the URL holds the state:
// <basePath>?q=agile&category=Timebars&sort=category&page=2. `hash` (e.g. '#all-posts') keeps the
// browser on the list after Filter, Clear or a page change.
import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'

// The filter values from a page's searchParams, checked.
export function readFilters(searchParams) {
  return {
    q: String(searchParams.q || '').trim(),
    category: CATEGORIES.includes(searchParams.category) ? searchParams.category : '',
    sort: searchParams.sort === 'category' ? 'category' : 'date',
    page: Math.max(1, parseInt(searchParams.page, 10) || 1),
  }
}

// showSort: false leaves out the Newest first / By category choice (the /posts bands have their own order).
export function PostFilterForm({ basePath, q, category, sort, hash = '', showSort = true }) {
  return (
    <form action={`${basePath}${hash}`} className="flex flex-wrap gap-3 rounded-lg bg-white p-4 shadow-sm">
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
      {showSort && (
        <select name="sort" defaultValue={sort} className="rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option value="date">Newest first</option>
          <option value="category">By category</option>
        </select>
      )}
      <div className="flex gap-2">
        <button type="submit" className="rounded-md bg-tbBlue px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">Filter</button>
        {(q || category || (showSort && sort !== 'date')) && (
          <Link href={`${basePath}${hash}`} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Clear</Link>
        )}
      </div>
    </form>
  )
}

export function PostCount({ pagination }) {
  return (
    <p className="text-sm text-gray-500">
      {pagination.total} {pagination.total === 1 ? 'post' : 'posts'}
      {pagination.pageCount > 1 && ` · page ${pagination.page} of ${pagination.pageCount}`}
    </p>
  )
}

export function PostPager({ basePath, q, category, sort, page, pageCount, hash = '' }) {
  if (pageCount <= 1) return null
  const pageHref = p =>
    `${basePath}?${new URLSearchParams({ ...(q && { q }), ...(category && { category }), ...(sort !== 'date' && { sort }), page: String(p) })}${hash}`
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
