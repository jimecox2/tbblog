'use client'

// /auth/signin — editor sign-in with a blog Strapi account (email or username, and password).
import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

const MESSAGES = {
  not_editor: 'This account is not a Content Editor. Ask an administrator to give it the role.',
  CredentialsSignin: 'Wrong email or password.',
}

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')?.startsWith('/') ? searchParams.get('callbackUrl') : '/editor'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const res = await signIn('credentials', { email, password, redirect: false })
      if (res?.error) {
        setError(MESSAGES[res.code] || MESSAGES[res.error] || 'Sign in failed. Please try again.')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError('The server could not be reached. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Email or username</span>
        <input
          required
          autoComplete="username"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-tbBlue2 focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Password</span>
        <input
          required
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-tbBlue2 focus:outline-none"
        />
      </label>
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-md bg-tbBlue px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
      >
        {busy ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  )
}

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-tbBlue">Editor Sign In</h1>
        <p className="mt-1 text-sm text-gray-600">For blog editors. Readers do not need an account.</p>
        <Suspense>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  )
}
