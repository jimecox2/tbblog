// "/" — the home page, laid out like the PMI blog (pmi.org/blog), with our nav and colours and no images:
//   Latest Posts      the four newest posts
//   Explore by topic  a tab per category with its four newest posts
//   then a link to All Posts by Category (/posts)
// with the blog's intro and the author's bio (BlogSidebar) down the right side, one card wide.
import Link from 'next/link'
import BlogSidebar from '@/components/BlogSidebar'
import PostCard from '@/components/PostCard'
import TopicTabs from '@/components/TopicTabs'
import { CATEGORIES } from '@/lib/categories'
import { toCardPost as toPost } from '@/lib/cardPost'
import { getArticles } from '@/lib/strapi'

export default async function HomePage() {
  const [latest, topics] = await Promise.all([
    getArticles({ pageSize: 4, withBody: true }),
    Promise.all(CATEGORIES.map(async category => {
      const { articles } = await getArticles({ category, pageSize: 4, withBody: true })
      return { category, posts: articles.map(toPost(160)) }
    })),
  ])

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-bold text-tbBlue">The Timebars Blog</h1>
        <p className="mt-2 text-gray-600">Insights on agile, project, portfolio and resource management.</p>
      </header>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <section aria-labelledby="latest-posts">
            <h2 id="latest-posts" className="text-2xl font-bold text-gray-900">Latest Posts</h2>
            {latest.articles.length ? (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {latest.articles.map(toPost(160)).map(p => <PostCard key={p.id} post={p} />)}
              </div>
            ) : (
              <p className="mt-6 text-gray-500">No posts yet.</p>
            )}
          </section>

          <section className="mt-16" aria-labelledby="explore-by-topic">
            <h2 id="explore-by-topic" className="text-2xl font-bold text-gray-900">Explore by topic</h2>
            <p className="mt-1 text-gray-600">Find posts based on your interests and expertise.</p>
            <div className="mt-6">
              <TopicTabs topics={topics} />
            </div>
          </section>

          <div className="mt-12">
            <Link href="/posts" className="inline-block rounded-md bg-tbBlue px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-800">
              All Posts by Category →
            </Link>
          </div>
        </div>

        <BlogSidebar />
      </div>
    </div>
  )
}
