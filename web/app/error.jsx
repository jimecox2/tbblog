'use client'

// Shown when a page fails, e.g. Strapi cannot be reached.
export default function Error({ reset }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Posts could not be loaded</h1>
      <p className="mt-2 text-gray-600">Please try again in a moment.</p>
      <button onClick={reset} className="mt-6 rounded-md bg-tbBlue px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">
        Try again
      </button>
    </div>
  )
}
