// config/site.js — public addresses only (they reach the browser), so never add a token, key or password.
//
// One image for every server: each value is read at run time from the server's .env.local
// (see .env.example). The server reads process.env; the root layout hands the same values to the
// browser as window.__TB_BLOG__ before any app code runs. Same pattern as helpapp's config/site.js.

const isServer = typeof window === 'undefined'

const runtime = isServer
  ? {
      blogUrl: process.env.BLOG_URL,
      wwwUrl: process.env.BLOG_WWW_URL,
      environment: process.env.TB_ENVIRONMENT,
    }
  : window.__TB_BLOG__ || {}

const pick = (value, fallback) =>
  typeof value === 'string' && value.trim() ? value.trim().replace(/\/+$/, '') : fallback

// This blog's own public address
export const BLOG_URL = pick(runtime.blogUrl, 'http://localhost:3011')

// The marketing site
export const WWW_URL = pick(runtime.wwwUrl, 'https://www.timebars.com')

// DEV, STAGING, PROD, TRAINING. Every one but PROD gets the dark red nav bar with its name. Unset = PROD.
export const TB_ENVIRONMENT = pick(runtime.environment, 'PROD').toUpperCase()
export const IS_PROD = TB_ENVIRONMENT === 'PROD'

// What the root layout sends to the browser (server only).
export const BROWSER_CONFIG = {
  blogUrl: BLOG_URL,
  wwwUrl: WWW_URL,
  environment: TB_ENVIRONMENT,
}
