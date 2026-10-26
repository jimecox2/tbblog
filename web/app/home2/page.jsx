// "/home2" — a home page after the category sections of github.blog, with our nav and colours and no images:
//   Latest Posts   the All Posts filters and paging, two columns of cards with a body excerpt (as on /home1),
//                  with the blog's intro and the author's bio (BlogSidebar) on the right, one card wide
//   one band per category with posts, featured post plus four more, alternating dark and white
// The filters keep their state in the URL (/home2?q=…&category=…&sort=…&page=…#latest).
import BlogSidebar from '@/components/BlogSidebar'
import Home1Card from '@/components/home1/Home1Card'
import CategorySection from '@/components/home2/CategorySection'
import { PostCount, PostFilterForm, PostPager, readFilters } from '@/components/PostFilters'
import { CATEGORIES } from '@/lib/categories'
import { toCardPost } from '@/lib/cardPost'
import { getArticles } from '@/lib/strapi'

export const metadata = { title: 'Home 2' }

const BASE = '/home2'
const HASH = '#latest'
const LATEST_PAGE_SIZE = 6

export default async function Home2Page({ searchParams }) {
  const filters = readFilters(searchParams)

  const [latest, sections] = await Promise.all([
    getArticles({ ...filters, pageSize: LATEST_PAGE_SIZE, withBody: true }),
    Promise.all(CATEGORIES.map(async category => {
      const { articles } = await getArticles({ category, pageSize: 5, withBody: true })
      return { category, posts: articles.map((a, i) => toCardPost(i === 0 ? 400 : 160)(a)) }
    })),
  ])
  // Categories without posts are left out, so every band has something in it.
  const bands = sections.filter(s => s.posts.length)

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-tbBlue">The Timebars Blog</h1>
        <p className="mt-2 text-gray-600">Insights on agile, project, portfolio and resource management.</p>
      </div>

      <section id="latest" className="scroll-mt-24 bg-white" aria-labelledby="latest-posts">
        <div className="mx-auto mt-10 max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="border-t-4 border-gray-900" />
          <h2 id="latest-posts" className="border-b border-gray-200 py-4 text-3xl font-bold text-gray-900">Latest Posts</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div>
                <PostFilterForm basePath={BASE} hash={HASH} {...filters} />
              </div>
              <div className="mt-6">
                <PostCount pagination={latest.pagination} />
              </div>
              <div className="mt-4">
                {latest.articles.length ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {latest.articles.map(toCardPost(500)).map(p => <Home1Card key={p.id} post={p} wide />)}
                  </div>
                ) : (
                  <p className="text-gray-500">No posts match.</p>
                )}
              </div>
              <PostPager basePath={BASE} hash={HASH} {...filters} pageCount={latest.pagination.pageCount} />
            </div>
            <BlogSidebar />
          </div>
        </div>
      </section>

      {bands.map((s, i) => (
        <CategorySection
          key={s.category}
          category={s.category}
          posts={s.posts}
          moreHref={`${BASE}?${new URLSearchParams({ category: s.category })}${HASH}`}
          dark={i % 2 === 0}
        />
      ))}
    </div>
  )
}
