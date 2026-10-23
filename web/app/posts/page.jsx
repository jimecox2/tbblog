// "/posts" — all posts with filters; built with the reader pages.
export const metadata = { title: 'All Posts' }

export default function PostsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-tbBlue">All Posts</h1>
      <p className="mt-2 text-gray-600">Posts will show here.</p>
    </div>
  )
}
