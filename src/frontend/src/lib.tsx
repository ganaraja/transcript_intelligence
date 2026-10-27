import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export const CALL_COLORS: Record<string, string> = {
  support: '#f59e0b',
  external: '#38bdf8',
  internal: '#a78bfa',
}

export function fmtSent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return value.toFixed(2)
}

export function Badge({ children, tone = 'slate' }: { children: ReactNode; tone?: string }) {
  const tones: Record<string, string> = {
    slate: 'bg-slate-800 text-slate-200',
    amber: 'bg-amber-500/15 text-amber-300',
    sky: 'bg-sky-500/15 text-sky-300',
    violet: 'bg-violet-500/15 text-violet-300',
    rose: 'bg-rose-500/15 text-rose-300',
    emerald: 'bg-emerald-500/15 text-emerald-300',
  }
  const callTone: Record<string, string> = {
    support: tones.amber,
    external: tones.sky,
    internal: tones.violet,
  }
  const cls = callTone[String(children).toLowerCase()] || tones[tone] || tones.slate
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {children}
    </span>
  )
}

export function Card({
  title,
  children,
  className = '',
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`rounded-xl border border-slate-800 bg-slate-900/60 p-4 ${className}`}>
      {title ? <h2 className="mb-3 text-sm font-semibold tracking-wide text-slate-300">{title}</h2> : null}
      {children}
    </section>
  )
}

export function MeetingLink({ id, title }: { id: string; title: string }) {
  return (
    <Link to={`/meetings/${id}`} className="text-sky-300 hover:underline">
      {title}
    </Link>
  )
}

export function Loading() {
  return <p className="p-8 text-slate-400">Loading…</p>
}

export function Err({ error }: { error: Error }) {
  return (
    <p className="p-8 text-rose-300">
      {error.message}. Start the API with <code>scripts/run-backend.sh</code>.
    </p>
  )
}
