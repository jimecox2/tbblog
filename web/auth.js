// auth.js — editor sign-in (NextAuth v5, as in helpapp) against the blog's own Strapi users.
//
// Only users whose Strapi role is in EDITOR_ROLES (default "Content Editor") may sign in. The Strapi token
// (jwt) is kept in the session cookie, encrypted, and used by the server for every editor call; it never
// reaches browser code.
import NextAuth, { CredentialsSignin } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { STRAPI_URL } from '@/lib/strapiUrl'

const editorRoles = () =>
  (process.env.EDITOR_ROLES || 'Content Editor').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)

class NotEditor extends CredentialsSignin {
  code = 'not_editor'
}

const secureCookies = process.env.NODE_ENV === 'production'
// Must match SESSION_COOKIE in middleware.js. Own names, so other Timebars apps on localhost do not collide.
export const SESSION_COOKIE = `${secureCookies ? '__Secure-' : ''}tbblog.session-token`

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize({ email, password }) {
        const login = await fetch(`${STRAPI_URL}/auth/local`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: email, password }),
          cache: 'no-store',
        })
        if (!login.ok) return null
        const { jwt, user } = await login.json()

        // The role needs Users-permissions → User → "me" allowed in Strapi.
        const me = await fetch(`${STRAPI_URL}/users/me?populate=role`, {
          headers: { Authorization: `Bearer ${jwt}` },
          cache: 'no-store',
        })
        const role = me.ok ? (await me.json()).role?.name : null
        if (!role || !editorRoles().includes(role.toLowerCase())) throw new NotEditor()

        return { id: String(user.id), name: user.username, email: user.email, jwt, role }
      },
    }),
  ],
  pages: { signIn: '/auth/signin' },
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 }, // same as Strapi's jwt.expiresIn (strapi/config/plugins.js)
  secret: process.env.AUTH_SECRET,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.strapiJwt = user.jwt
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      session.user.role = token.role
      return session
    },
  },
  cookies: {
    sessionToken: {
      name: SESSION_COOKIE,
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: secureCookies },
    },
    callbackUrl: {
      name: `${secureCookies ? '__Secure-' : ''}tbblog.callback-url`,
      options: { sameSite: 'lax', path: '/', secure: secureCookies },
    },
    csrfToken: {
      name: `${secureCookies ? '__Host-' : ''}tbblog.csrf-token`,
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: secureCookies },
    },
  },
  trustHost: true,
})
