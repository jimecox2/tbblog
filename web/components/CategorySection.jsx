// One category band, after github.blog's sections: a thick rule, the heading with a "More … articles"
// link, a thin rule, then the featured post on the left and the next four listed on the right. Any
// further posts follow below in two columns. `dark` switches the band to the dark background;
// no `moreHref` leaves the link out.
import Link from 'next/link'
import SectionPost from '@/components/SectionPost'

export default function CategorySection({ category, posts, moreHref, dark = false, children }) {
  const [featured, ...rest] = posts
  const side = rest.slice(0, 4)
  const below = rest.slice(4)
  const line = dark ? 'border-gray-700' : 'border-gray-200'
  const divide = dark ? 'divide-gray-700' : 'divide-gray-200'
  return (
    <section className={dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} aria-label={category}>
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className={`border-t-4 ${dark ? 'border-white' : 'border-gray-900'}`} />
        <div className={`flex flex-wrap items-baseline justify-between gap-2 border-b py-4 ${line}`}>
          <h2 className="text-3xl font-bold">{category}</h2>
          {moreHref && (
            <Link href={moreHref} className={`text-sm font-medium hover:underline ${dark ? 'text-blue-300' : 'text-tbBlue2'}`}>
              More {category} articles →
            </Link>
          )}
        </div>
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <SectionPost post={featured} featured dark={dark} />
          {side.length > 0 && (
            <ul className={`divide-y ${divide}`}>
              {side.map(p => (
                <li key={p.id} className="py-5 first:pt-0 last:pb-0">
                  <SectionPost post={p} dark={dark} />
                </li>
              ))}
            </ul>
          )}
        </div>
        {below.length > 0 && (
          <ul className={`mt-10 grid grid-cols-1 gap-x-10 border-t pt-5 lg:grid-cols-2 ${line}`}>
            {below.map(p => (
              <li key={p.id} className={`border-b py-5 ${line}`}>
                <SectionPost post={p} dark={dark} />
              </li>
            ))}
          </ul>
        )}
        {children}
      </div>
    </section>
  )
}
