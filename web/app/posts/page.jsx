// "/posts" — All Posts as category bands (after github.blog), alternating dark and white, under the search
// and category filter. Without a category every category with matching posts gets a band of its five
// newest; with one, that category's band holds 20 posts a page with Previous/Next.
// The filters are a plain GET form, so the URL holds them: /posts?q=agile&category=Timebars&page=2
import CategorySection from '@/components/CategorySection'
import { PostFilterForm, PostPager, readFilters } from '@/components/PostFilters'
import { CATEGORIES } from '@/lib/categories'
import { toCardPost } from '@/lib/cardPost'
import { getArticles } from '@/lib/strapi'

export const metadata = { title: 'All Posts' }

const BASE = '/posts'

// The featured post gets a longer excerpt than the rest.
const toBandPosts = articles => articles.map((a, i) => toCardPost(i === 0 ? 400 : 160)(a))

export default async function PostsPage({ searchParams }) {
  const { q, category, page } = readFilters(searchParams)

  let bands
  let pageCount = 1
  if (category) {
    const { articles, pagination } = await getArticles({ q, category, page, withBody: true })
    bands = [{ category, posts: toBandPosts(articles) }]
    pageCount = pagination.pageCount
  } else {
    bands = await Promise.all(CATEGORIES.map(async c => {
      const { articles } = await getArticles({ q, category: c, pageSize: 5, withBody: true })
      return { category: c, posts: toBandPosts(articles) }
    }))
  }
  bands = bands.filter(b => b.posts.length)

  return (
    <div>
      <div className="bg-gray-100 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

         <header>
          <p className="mt-3 text-lg text-gray-800">
            <strong>All Posts by Category:</strong> Solve your agile, project, portfolio and resource
            management problems. Learn about Timebars Ltd. software products and AI integration 
            achievements that improve productivity.
          </p>
        </header>

        <div className="mt-6">

          <PostFilterForm basePath={BASE} q={q} category={category} />
        </div>
        {!bands.length && <p className="mt-8 text-gray-500">No posts match.</p>}
      </div>

      {bands.map((b, i) => (
        <CategorySection
          key={b.category}
          category={b.category}
          posts={b.posts}
          moreHref={category ? null : `${BASE}?${new URLSearchParams({ ...(q && { q }), category: b.category })}`}
          dark={i % 2 === 0}
        >
          {category && <PostPager basePath={BASE} q={q} category={category} page={page} pageCount={pageCount} />}
        </CategorySection>
      ))}
    </div>
  )
}
