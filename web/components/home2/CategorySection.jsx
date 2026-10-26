// One category band on /home2, after github.blog's sections: a thick rule, the heading with a "More …
// articles" link, a thin rule, then the featured post on the left and the next ones listed on the right.
// `dark` switches the band to the dark background.
import Link from 'next/link'
import SectionPost from '@/components/home2/SectionPost'

export default function CategorySection({ category, posts, moreHref, dark = false }) {
  const [featured, ...rest] = posts
  const line = dark ? 'border-gray-700' : 'border-gray-200'
  return (
    <section className={dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} aria-label={category}>
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className={`border-t-4 ${dark ? 'border-white' : 'border-gray-900'}`} />
        <div className={`flex flex-wrap items-baseline justify-between gap-2 border-b py-4 ${line}`}>
          <h2 className="text-3xl font-bold">{category}</h2>
          <Link href={moreHref} className={`text-sm font-medium hover:underline ${dark ? 'text-blue-300' : 'text-tbBlue2'}`}>
            More {category} articles →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <SectionPost post={featured} featured dark={dark} />
          {rest.length > 0 && (
            <ul className={`divide-y ${dark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {rest.map(p => (
                <li key={p.id} className="py-5 first:pt-0 last:pb-0">
                  <SectionPost post={p} dark={dark} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
