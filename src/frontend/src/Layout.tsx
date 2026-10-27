import { AudioLines } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Overview' },
  { to: '/themes', label: 'Themes' },
  { to: '/sentiment', label: 'Sentiment' },
  { to: '/graph', label: 'Issue graph' },
  { to: '/accounts', label: 'Risk radar' },
]

export default function Layout() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3">
          <div className="flex items-center gap-2 text-sky-300">
            <AudioLines size={20} />
            <span className="font-semibold tracking-tight text-slate-100">Transcript Intelligence</span>
          </div>
          <nav className="flex gap-1 text-sm">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 ${isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-6">
        <Outlet />
      </main>
    </div>
  )
}
