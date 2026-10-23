import './globals.css'
import Script from 'next/script'
import AppNavbar from '@/components/AppNavbar'
import { BLOG_URL, BROWSER_CONFIG } from '@/config/site'

// Addresses come from the server's environment at run time (config/site.js), so no page is built ahead.
export const dynamic = 'force-dynamic'

export const metadata = {
  metadataBase: new URL(BLOG_URL),
  title: {
    default: 'Timebars Blog – Agile, Project, Portfolio and Resource Management',
    template: '%s | Timebars Blog',
  },
  description:
    'Articles from Timebars Ltd. on agile, project, portfolio and resource management, and on Agilebars, Timebars and Costbars.',
  openGraph: {
    title: 'Timebars Blog',
    url: '/',
    siteName: 'Timebars Blog',
    images: [{ url: '/images/timebars-ltd-logo-final.png', alt: 'Timebars Ltd.' }],
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Per-server addresses for browser code; runs before any app code (config/site.js). */}
        <Script id="tb-blog-config" strategy="beforeInteractive">
          {`window.__TB_BLOG__=${JSON.stringify(BROWSER_CONFIG).replace(/</g, '\\u003c')}`}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <AppNavbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
