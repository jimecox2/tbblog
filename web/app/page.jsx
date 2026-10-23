// "/" — home page: recent posts (last 2 months) come with the reader pages.
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-tbBlue">Timebars Blog</h1>
      <p className="mt-2 text-gray-600">Recent posts will show here.</p>
      <Link href="/posts" className="mt-8 inline-block font-medium text-tbBlue2 hover:underline">
        All Posts →
      </Link>
    </div>
  )
}
