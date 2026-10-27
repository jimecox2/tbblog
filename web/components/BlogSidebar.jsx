// The right-hand column on the home pages: what this blog is about, the problems it writes about
// (the same list as /learn on the Timebars Ltd. site), and a short bio. Each box is one post card wide.
// The text lives here on purpose; edit it freely.
import { WWW_URL } from '@/config/site'
import Image from 'next/image'
// From the "The problem you have" list in tbwww components/Learn/learnNav.js
const PROBLEMS = [
  { slug: 'the-it-demand-backlog-problem', label: 'Hundreds of requests, one delivery team' },
  { slug: 'from-business-case-to-sprint', label: 'The data you lose between approval and delivery' },
  { slug: 'solving-problems-timebars', label: 'People are overallocated and nobody sees it in time' },
  { slug: 'agilebars-solving-problems-with-our-sprint-scheduler', label: 'Sprint reports and the project schedule disagree' },
  { slug: 'costbars-solving-problems-with-our-project-pipeline-scheduler', label: 'Projects start without anyone deciding they should' },
  { slug: 'project-status-reporting-traffic-light-indicator-questions', label: 'Status reports nobody reads or trusts' },
  { slug: 'blog-agile-and-resource-management-is-there-an-conflict', label: 'Agile and waterfall against one resource pool' },
  { slug: 'the-legacy-pm-system-problem', label: 'Your project system cannot keep up with the organisation' },
]

const box = 'rounded-2xl bg-white p-7 shadow-[0_2px_12px_rgba(16,24,64,0.06)] ring-1 ring-black/[0.03]'
const heading = 'text-xs font-semibold uppercase tracking-wide text-tbBlue2'
const link = 'font-medium text-tbBlue2 hover:underline'

export function AboutThisBlog() {
  return (
    <section className={box} aria-labelledby="about-this-blog">
      <p id="about-this-blog" className={heading}>About this blog</p>
      <h2 className="mt-2 text-lg font-semibold leading-snug text-gray-900">Articles that solve planning problems</h2>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">
        For project managers, resource managers, Scrum teams, PMOs and portfolio managers. We write from the problem
        that sent you searching, not from a feature list: each post starts with something going wrong in a real
        organisation and shows a way to fix it.
      </p>
      <p className="mt-4 text-sm font-semibold text-gray-900">What you will find here</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
        <li>How-tos for Agilebars, Timebars and Costbars</li>
        <li>Timebars Cloud: the help library, Ask AI and the Enterprise Dashboard</li>
        <li>Methods: agile, project, portfolio and resource management</li>
      </ul>
      <p className="mt-4 text-sm font-semibold text-gray-900">Problems we write about</p>
      <ul className="mt-2 space-y-2 text-sm">
        {PROBLEMS.map(p => (
          <li key={p.slug}>
            <a href={`${WWW_URL}/learn/${p.slug}`} className={link}>{p.label}</a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function AuthorBio() {
  return (
    <section className={box} aria-labelledby="author-bio">
      <p id="author-bio" className={heading}>About the author</p>
      <h2 className="mt-2 text-lg font-semibold text-gray-900">Jim Cox</h2>
      <p className="text-sm text-gray-500">Founder, Timebars Ltd., Ottawa, Canada</p>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">
        Jim is an enterprise IM/IT solutions expert with over 30 years of project experience in government and large
        private-sector organisations, delivering project and portfolio management, document management and business
        intelligence systems. He works in both waterfall and agile, from business cases and requirements to
        architecture, data migration and modern web development, and builds Agilebars, Timebars and Costbars.
      </p>
      <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <a href={`${WWW_URL}/sales/about-us`} className={link}>About Timebars Ltd.</a>
        <a href={`${WWW_URL}/sales/contact-us`} className={link}>Contact Jim</a>
      </p>
    </section>
  )
}

export default function BlogSidebar() {
  return (
    <aside className="space-y-6" aria-label="About this blog">
      <div className="mt-8 flex justify-center">
        <a
          href="https://tb.timebars.com"
          title="Take a look at Timebars Resource Scheduler"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full max-w-md transition hover:opacity-90"
        >
          <Image
            src="/images/timebars-shout-out.png"
            alt="Timebars shout out"
            width={1378}
            height={226}
            className="h-auto w-full max-w-sm rounded-lg shadow"
          />
        </a>
      </div>
      <AboutThisBlog />
      <div className="mt-8 flex justify-center">
        <a
          href="https://cb.timebars.com"
          title="Take a look at Costbars Project Portfolio Scheduler"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full max-w-md transition hover:opacity-90"
        >
          <Image
            src="/images/costbars-shout-out.png"
            alt="Costbars shout out"
            width={1504}
            height={226}
            className="h-auto w-full max-w-sm rounded-lg shadow"
          />
        </a>
      </div>
      <AuthorBio />

      <div className="mt-8 flex justify-center">
        <a
          href="https://ab.timebars.com"
          title="Take a look at Agilebars Sprint Scheduler"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full max-w-md transition hover:opacity-90"
        >
          <Image
            src="/images/agilebars-shout-out.png"
            alt="Agilebars shout out"
            width={1173}
            height={231}
            className="h-auto w-full max-w-sm rounded-lg shadow"
          />
        </a>
      </div>

    </aside>
  )
}
