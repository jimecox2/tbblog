// The article editor (title, category, author, description, markdown body) comes in the next step.
import Link from 'next/link'

export default function EditArticlePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/editor" className="text-sm text-tbBlue2 hover:underline">← Articles</Link>
      <p className="mt-6 text-gray-600">The article editor is the next step of the build.</p>
    </div>
  )
}
