'use client'
// "Explore by topic" on the home page: one tab per category, each showing that category's latest posts.
// Every tab's posts come from the server at once, so switching tabs needs no request.
import { useState } from 'react'
import PostCard from '@/components/PostCard'

export default function TopicTabs({ topics }) {
  const [active, setActive] = useState(topics.find(t => t.posts.length)?.category || topics[0]?.category)
  const current = topics.find(t => t.category === active)

  return (
    <div>
      <div role="tablist" aria-label="Topics" className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {topics.map(t => {
          const selected = t.category === active
          return (
            <button
              key={t.category}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(t.category)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                selected ? 'bg-tbBlue text-white shadow' : 'bg-white text-gray-700 shadow-sm hover:bg-blue-50 hover:text-tbBlue'
              }`}
            >
              {t.category}
            </button>
          )
        })}
      </div>

      <div role="tabpanel" className="mt-6">
        <h3 className="text-xl font-semibold text-gray-900">{current?.category}</h3>
        {current?.posts.length ? (
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {current.posts.map(p => <PostCard key={p.id} post={p} />)}
          </div>
        ) : (
          <p className="mt-4 text-gray-500">No posts in this topic yet.</p>
        )}
      </div>
    </div>
  )
}
