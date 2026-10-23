'use client'

// The editors' article table. Tick rows, then Delete at the top; Edit on each row's left.
import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { deleteArticles } from '@/app/editor/actions'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

function Status({ article }) {
  if (!article.publishedAt) return <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">Draft</span>
  return (
    <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
      Published{article.changed && ' · changed'}
    </span>
  )
}

export default function ArticleTable({ articles }) {
  const router = useRouter()
  const [selected, setSelected] = useState(() => new Set())
  const [filter, setFilter] = useState('')
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  const rows = useMemo(() => {
    const f = filter.trim().toLowerCase()
    return f ? articles.filter(a => [a.title, a.category, a.authorName].some(v => v?.toLowerCase().includes(f))) : articles
  }, [articles, filter])

  const toggle = id => setSelected(s => {
    const n = new Set(s)
    n.has(id) ? n.delete(id) : n.add(id)
    return n
  })
  const allChecked = rows.length > 0 && rows.every(a => selected.has(a.documentId))
  const toggleAll = () => setSelected(allChecked ? new Set() : new Set(rows.map(a => a.documentId)))

  function onDelete() {
    const ids = [...selected]
    const titles = articles.filter(a => selected.has(a.documentId)).map(a => `• ${a.title}`).join('\n')
    if (!window.confirm(`Delete ${ids.length} article${ids.length > 1 ? 's' : ''}? This cannot be undone.\n\n${titles}`)) return
    setError('')
    startTransition(async () => {
      const res = await deleteArticles(ids)
      if (!res.ok) setError(res.error)
      setSelected(new Set())
      router.refresh()
    })
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href="/editor/new" className="inline-flex items-center gap-1.5 rounded-md bg-tbBlue px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-800">
          <Plus className="h-4 w-4" /> Create
        </Link>
        <button
          onClick={onDelete}
          disabled={!selected.size || pending}
          className="inline-flex items-center gap-1.5 rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" /> {pending ? 'Deleting…' : `Delete${selected.size ? ` (${selected.size})` : ''}`}
        </button>
        <input
          type="search"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filter by title, category or author"
          className="ml-auto w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-tbBlue2 focus:outline-none sm:w-72"
        />
      </div>
      {error && <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mt-4 overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="w-10 px-4 py-3"><input type="checkbox" aria-label="Select all" checked={allChecked} onChange={toggleAll} /></th>
              <th className="w-20 px-2 py-3"><span className="sr-only">Edit</span></th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(a => (
              <tr key={a.documentId} className={cn('hover:bg-blue-50/40', selected.has(a.documentId) && 'bg-blue-50')}>
                <td className="px-4 py-3">
                  <input type="checkbox" aria-label={`Select ${a.title}`} checked={selected.has(a.documentId)} onChange={() => toggle(a.documentId)} />
                </td>
                <td className="px-2 py-3">
                  <Link href={`/editor/${a.documentId}`} className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Link>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{a.title}</td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-600">{a.category}</td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-600">{a.authorName}</td>
                <td className="whitespace-nowrap px-4 py-3"><Status article={a} /></td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatDate(a.publishedAt)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatDate(a.updatedAt)}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-500">No articles.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-gray-500">{rows.length} of {articles.length} articles</p>
    </>
  )
}
