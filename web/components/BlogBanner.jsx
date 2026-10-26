// The dark banner at the top of the home page: the Timebars logo, the blog's name and its tagline
// (after the Timebars Resource Scheduler banner).
import Image from 'next/image'
import logo from '@/public/images/tblogo2026.png'

export default function BlogBanner() {
  return (
    <section className="bg-gradient-to-r from-[#1b2140] via-[#1d2650] to-[#22306b]">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-10 sm:gap-8 sm:px-6 sm:py-12 lg:px-8">
        <Image
          src={logo}
          alt="Timebars logo"
          priority
          unoptimized
          className="h-20 w-20 shrink-0 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:h-28 sm:w-28"
        />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">The Timebars Blog</h1>
          <p className="mt-2 text-base text-blue-300 sm:mt-3 sm:text-xl">
            Insights on agile, project, portfolio and resource management.
          </p>
        </div>
      </div>
    </section>
  )
}
