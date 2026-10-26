// "/home1" — a home page laid out like the PMI blog (pmi.org/blog), with our nav and colours and no images:
//   Latest Posts      the four newest posts
//   Explore by topic  a tab per category with its four newest posts
//   All Blog Posts    the All Posts filters and paging, two columns, with a 500-character body excerpt
// The filters keep their state in the URL (/home1?q=…&category=…&sort=…&page=…#all-posts).
import Home1Card from '@/components/home1/Home1Card'
import TopicTabs from '@/components/home1/TopicTabs'
import { PostCount, PostFilterForm, PostPager, readFilters } from '@/components/PostFilters'
import { CATEGORIES } from '@/lib/categories'
import { toCardPost as toPost } from '@/lib/cardPost'
import { getArticles } from '@/lib/strapi'

export const metadata = { title: 'Home 1' }

const BASE = '/home1'
const HASH = '#all-posts'

export default async function Home1Page({ searchParams }) {
  const filters = readFilters(searchParams)

  const [latest, topics, all] = await Promise.all([
    getArticles({ pageSize: 4, withBody: true }),
    Promise.all(CATEGORIES.map(async category => {
      const { articles } = await getArticles({ category, pageSize: 4, withBody: true })
      return { category, posts: articles.map(toPost(160)) }
    })),
    getArticles({ ...filters, withBody: true }),
  ])

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-bold text-tbBlue">The Timebars Blog</h1>
        <p className="mt-2 text-gray-600">Insights on agile, project, portfolio and resource management.</p>
      </header>

      <section className="mt-12" aria-labelledby="latest-posts">
        <h2 id="latest-posts" className="text-2xl font-bold text-gray-900">Latest Posts</h2>
        {latest.articles.length ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {latest.articles.map(toPost(160)).map(p => <Home1Card key={p.id} post={p} />)}
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

      <section id="all-posts" className="mt-16 scroll-mt-24" aria-labelledby="all-blog-posts">
        <h2 id="all-blog-posts" className="text-2xl font-bold text-gray-900">All Blog Posts</h2>
        <div className="mt-6">
          <PostFilterForm basePath={BASE} hash={HASH} {...filters} />
        </div>
        <div className="mt-6">
          <PostCount pagination={all.pagination} />
        </div>
        <div className="mt-4">
          {all.articles.length ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {all.articles.map(toPost(500)).map(p => <Home1Card key={p.id} post={p} wide />)}
            </div>
          ) : (
            <p className="text-gray-500">No posts match.</p>
          )}
        </div>
        <PostPager basePath={BASE} hash={HASH} {...filters} pageCount={all.pagination.pageCount} />
      </section>
    </div>
  )
}
