// middleware.js — the editor pages (/editor/...) need a signed-in Content Editor; everything else is public.
// The role is checked at sign-in (auth.js); here only the session cookie is.
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const secureCookie = process.env.NODE_ENV === 'production'
// Must match SESSION_COOKIE in auth.js.
const SESSION_COOKIE = `${secureCookie ? '__Secure-' : ''}tbblog.session-token`

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie, cookieName: SESSION_COOKIE, salt: SESSION_COOKIE })
  if (token) return NextResponse.next()
  const signIn = req.nextUrl.clone()
  signIn.pathname = '/auth/signin'
  signIn.search = `?callbackUrl=${encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)}`
  return NextResponse.redirect(signIn)
}

export const config = { matcher: ['/editor/:path*', '/editor'] }
