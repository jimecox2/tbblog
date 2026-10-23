// GET /uploads/<file> — images uploaded to Strapi, passed through from the private Strapi container,
// so article images work without putting Strapi on the internet.
import { STRAPI_ORIGIN } from '@/lib/strapiUrl'

export async function GET(request, { params }) {
  const path = params.path.map(encodeURIComponent).join('/')
  const res = await fetch(`${STRAPI_ORIGIN}/uploads/${path}`, { cache: 'no-store' })
  if (!res.ok) return new Response('Not found', { status: 404 })
  const headers = new Headers({ 'Cache-Control': 'public, max-age=86400' })
  for (const h of ['content-type', 'content-length', 'last-modified', 'etag']) {
    if (res.headers.get(h)) headers.set(h, res.headers.get(h))
  }
  headers.set('X-Content-Type-Options', 'nosniff')
  return new Response(res.body, { status: 200, headers })
}
