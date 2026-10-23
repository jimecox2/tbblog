// "/" — home page: posts from the last two months, then a link to All Posts.
import Link from 'next/link'
import { PostGrid } from '@/components/PostCard'
import { getRecentArticles } from '@/lib/strapi'

export default async function HomePage() {
  const articles = await getRecentArticles()
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-tbBlue">Timebars Blog</h1>
      <p className="mt-2 text-gray-600">Recent posts on agile, project, portfolio and resource management.</p>

      <div className="mt-10">
        {articles.length ? (
          <PostGrid articles={articles} />
        ) : (
          <p className="text-gray-500">No posts in the last two months.</p>
        )}
      </div>

      <div className="mt-12 text-center">
        <Link href="/posts" className="inline-block rounded-md bg-tbBlue px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-800">
          All Posts →
        </Link>
      </div>
    </div>
  )
}
