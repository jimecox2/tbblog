'use client'

// The article editor: title, slug, category, author, description and the markdown body.
// Save draft keeps the change private; Publish puts it on the blog.
import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import MarkdownEditor from '@/components/editor/MarkdownEditor'
import { saveArticle } from '@/app/editor/actions'
import { CATEGORIES } from '@/lib/categories'
import { formatDate } from '@/lib/format'
import { slugify } from '@/lib/slug'

const input = 'mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-tbBlue2 focus:outline-none'

export default function ArticleForm({ article, defaultAuthor }) {
  const router = useRouter()
  const isNew = !article
  const [fields, setFields] = useState(() => ({
    title: article?.title || '',
    slug: article?.slug || '',
    category: article?.category || '',
    authorName: article?.authorName ?? defaultAuthor ?? '',
    description: article?.description || '',
    body: article?.body || '',
  }))
  // A new article's slug follows its title until the editor types their own.
  const [slugTouched, setSlugTouched] = useState(!isNew)
  const [dirty, setDirty] = useState(false)
  // A new article's first save lands here as /editor/<id>?saved=draft|published
  const saved = useSearchParams().get('saved')
  const [message, setMessage] = useState(saved ? { text: saved === 'published' ? 'Published.' : 'Draft saved.' } : null)
  const [pending, startTransition] = useTransition()

  const set = (key, value) => {
    setFields(f => ({ ...f, [key]: value, ...(key === 'title' && !slugTouched && { slug: slugify(value) }) }))
    setDirty(true)
  }

  useEffect(() => {
    if (!dirty) return
    const warn = e => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  function submit(publish) {
    setMessage(null)
    startTransition(async () => {
      const res = await saveArticle(article?.documentId, fields, publish)
      if (!res.ok) return setMessage({ error: true, text: res.error })
      setDirty(false)
      setFields(f => ({ ...f, slug: res.slug }))
      setMessage({ text: publish ? 'Published.' : 'Draft saved.' })
      if (isNew) router.replace(`/editor/${res.documentId}?saved=${publish ? 'published' : 'draft'}`)
      else router.refresh()
    })
  }

  const published = !!article?.publishedAt
  return (
    <form onSubmit={e => { e.preventDefault(); submit(false) }} className="mt-6 space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-lg bg-white p-4 shadow-md">
        <span className="text-sm text-gray-600">
          {isNew ? 'New article' : published ? `Published ${formatDate(article.publishedAt)}` : 'Draft, not published'}
          {dirty && ' · unsaved changes'}
        </span>
        {published && article.slug && (
          <Link href={`/posts/${article.slug}`} target="_blank" className="inline-flex items-center gap-1 text-sm text-tbBlue2 hover:underline">
            View on blog <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}
        <div className="ml-auto flex gap-2">
          <Link href="/editor" className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Back</Link>
          <button type="submit" disabled={pending} className="rounded-md border border-tbBlue px-4 py-2 text-sm font-medium text-tbBlue hover:bg-blue-50 disabled:opacity-60">
            Save draft
          </button>
          <button type="button" disabled={pending} onClick={() => submit(true)} className="rounded-md bg-tbBlue px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-800 disabled:opacity-60">
            {pending ? 'Saving…' : published ? 'Publish changes' : 'Publish'}
          </button>
        </div>
        {message && (
          <p className={`w-full rounded-md px-3 py-2 text-sm ${message.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{message.text}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 rounded-lg bg-white p-6 shadow-md md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-gray-700">Title</span>
          <input required value={fields.title} onChange={e => set('title', e.target.value)} className={`${input} text-base font-medium`} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Category</span>
          <select required value={fields.category} onChange={e => set('category', e.target.value)} className={input}>
            <option value="" disabled>Choose a category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Author</span>
          <input value={fields.authorName} onChange={e => set('authorName', e.target.value)} className={input} />
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-gray-700">Slug</span>
          <span className="ml-2 text-xs text-gray-500">the address: /posts/{fields.slug || '…'}</span>
          <input
            value={fields.slug}
            onChange={e => { setSlugTouched(true); set('slug', e.target.value) }}
            onBlur={() => setFields(f => ({ ...f, slug: slugify(f.slug) }))}
            className={`${input} font-mono`}
          />
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-gray-700">Description</span>
          <span className="ml-2 text-xs text-gray-500">shown on the post cards</span>
          <textarea rows={2} value={fields.description} onChange={e => set('description', e.target.value)} className={input} />
        </label>
      </div>

      <div>
        <span className="text-sm font-medium text-gray-700">Article</span>
        <div className="mt-1">
          <MarkdownEditor value={fields.body} onChange={v => set('body', v)} />
        </div>
      </div>
    </form>
  )
}
