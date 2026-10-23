'use client'

// Main navigation for the Timebars blog. Copied from helpapp's AppNavbar (same dark-blue gradient), with
// "Blog" in place of "Cloud". Every environment but PROD (TB_ENVIRONMENT) gets a dark red bar with its name.
// Signed-in editors also get Articles (/editor) and Sign Out; everyone else sees Editor Sign In.

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Menu, X } from 'lucide-react'
import { WWW_URL, TB_ENVIRONMENT, IS_PROD } from '@/config/site'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'All Posts', href: '/posts' },
  { label: 'Visit Timebars Ltd.', href: WWW_URL, external: true },
]

const isActive = (pathname, href) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`))

function NavLink({ item, pathname, onClick, className }) {
  const cls = cn(className, !item.external && isActive(pathname, item.href) && 'bg-white/20')
  return item.external ? (
    <a href={item.href} className={cls} onClick={onClick}>{item.label}</a>
  ) : (
    <Link href={item.href} className={cls} onClick={onClick}>{item.label}</Link>
  )
}

export default function AppNavbar() {
  const pathname = usePathname() || '/'
  const { data: session, status } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const close = () => setMobileOpen(false)
  const items = session ? [...NAV.slice(0, 2), { label: 'Articles', href: '/editor' }, ...NAV.slice(2)] : NAV

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full border-b shadow-md bg-gradient-to-r',
        IS_PROD ? 'border-blue-300/40 from-blue-900 via-blue-700 to-blue-500' : 'border-red-300/40 from-red-950 via-red-900 to-red-700',
      )}
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md p-2 text-blue-100 hover:bg-white/15 hover:text-white md:hidden"
              aria-label="Open main menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(o => !o)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href="/" className="flex shrink-0 items-center gap-2" onClick={close}>
              <Image src="/images/timebars-ltd-logo-final-w.svg" alt="Timebars Ltd." width={150} height={48} className="h-12 w-auto" priority />
              <span className="hidden pr-2 text-sm font-semibold text-blue-100 sm:inline">Blog</span>
              {!IS_PROD && (
                <span className="rounded bg-white px-2 py-0.5 text-xs font-bold tracking-wide text-red-800" title="Not production">
                  {TB_ENVIRONMENT}
                </span>
              )}
            </Link>
            <div className="ml-2 hidden items-center gap-0.5 md:flex">
              {items.map(item => (
                <NavLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  className="whitespace-nowrap rounded-md px-2.5 py-2 text-sm text-white hover:bg-white/15"
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {session ? (
              <>
                <span className="hidden max-w-[12rem] truncate text-sm text-blue-100 lg:inline">{session.user?.name || session.user?.email}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="rounded-md bg-white/15 px-3 py-2 text-sm text-white hover:bg-white/25"
                >
                  Sign Out
                </button>
              </>
            ) : (
              status !== 'loading' && (
                <Link href="/auth/signin" className="rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-50">
                  Editor Sign In
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/20 px-2 pb-3 pt-2 md:hidden">
          {items.map(item => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              onClick={close}
              className="block rounded-md px-3 py-2 text-base text-white hover:bg-white/15"
            />
          ))}
        </div>
      )}
    </nav>
  )
}
