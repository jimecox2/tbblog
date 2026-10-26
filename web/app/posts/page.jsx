// "/posts" — every post, 20 a page. Filters (title/description text, category) and the sort are a plain
// GET form, so the URL holds them: /posts?q=agile&category=Timebars&sort=category&page=2
import { PostGrid } from '@/components/PostCard'
import { PostCount, PostFilterForm, PostPager, readFilters } from '@/components/PostFilters'
import { getArticles } from '@/lib/strapi'

export const metadata = { title: 'All Posts' }

export default async function PostsPage({ searchParams }) {
  const filters = readFilters(searchParams)
  const { articles, pagination } = await getArticles(filters)

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-tbBlue">All Posts</h1>

      <div className="mt-6">
        <PostFilterForm basePath="/posts" {...filters} />
      </div>

      <div className="mt-6">
        <PostCount pagination={pagination} />
      </div>

      <div className="mt-4">
        {articles.length ? <PostGrid articles={articles} /> : <p className="text-gray-500">No posts match.</p>}
      </div>

      <PostPager basePath="/posts" {...filters} pageCount={pagination.pageCount} />
    </div>
  )
}
