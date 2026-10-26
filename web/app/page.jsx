// "/" — the home page, laid out like the PMI blog (pmi.org/blog), with our nav and colours and no images:
//   Latest Posts      the four newest posts
//   Explore by topic  a tab per category with its four newest posts
//   then a link to All Posts by Category (/posts)
// under the banner (BlogBanner), with the blog's intro and the author's bio (BlogSidebar) down the
// right side, one card wide.
import Link from 'next/link'
import BlogBanner from '@/components/BlogBanner'
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
    <div className="bg-gradient-to-b from-[#eef1fb] via-[#f5f6fc] to-white">
      <BlogBanner />
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <section aria-labelledby="latest-posts">
              <h2 id="latest-posts" className="text-3xl font-bold tracking-tight text-gray-900">Latest Posts</h2>
              {latest.articles.length ? (
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {latest.articles.map(toPost(160)).map(p => <PostCard key={p.id} post={p} />)}
                </div>
              ) : (
                <p className="mt-6 text-gray-500">No posts yet.</p>
              )}
            </section>

            <section className="mt-16" aria-labelledby="explore-by-topic">
              <h2 id="explore-by-topic" className="text-3xl font-bold tracking-tight text-gray-900">Explore by topic</h2>
              <p className="mt-1 text-gray-600">Find posts based on your interests and expertise.</p>
              <div className="mt-6">
                <TopicTabs topics={topics} />
              </div>
            </section>

            <div className="mt-12">
              <Link href="/posts" className="inline-flex items-center gap-2 rounded-full bg-tbBlue px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,25,204,0.25)] transition hover:-translate-y-0.5 hover:bg-blue-800">
                All Posts by Category →
              </Link>
            </div>
          </div>

          <BlogSidebar />
        </div>
      </div>
    </div>
  )
}
