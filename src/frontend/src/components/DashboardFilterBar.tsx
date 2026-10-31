import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api'
import type { CallType, Meeting } from '../types'
import type { Stakeholder } from '../dashboardFilters'

const callTypes: Array<{ value: CallType | ''; label: string }> = [
  { value: '', label: 'All call types' },
  { value: 'support', label: 'Support' },
  { value: 'external', label: 'External / sales' },
  { value: 'internal', label: 'Internal' },
]

const stakeholders: Array<{ value: Stakeholder; label: string }> = [
  { value: 'all', label: 'All stakeholders' },
  { value: 'support', label: 'Support' },
  { value: 'sales', label: 'Sales' },
  { value: 'product', label: 'Product' },
  { value: 'engineering', label: 'Engineering' },
]

const controlClass =
  'min-w-0 rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-200'

export default function DashboardFilterBar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const meetings = useQuery({ queryKey: ['meetings'], queryFn: api.meetings })
  const modules = [...new Set((meetings.data ?? []).flatMap((meeting) => meeting.product_modules))].sort()
  const accounts = [
    ...new Set(
      (meetings.data ?? [])
        .map((meeting: Meeting) => meeting.customer_name)
        .filter((account): account is string => Boolean(account)),
    ),
  ].sort()

  const value = (key: string) => searchParams.get(key) ?? ''
  const update = (key: string, nextValue: string) => {
    const next = new URLSearchParams(searchParams)
    if (nextValue) next.set(key, nextValue)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }
  const reset = () => {
    const next = new URLSearchParams(searchParams)
    for (const key of ['stakeholder', 'callType', 'module', 'account', 'from', 'to']) {
      next.delete(key)
    }
    setSearchParams(next, { replace: true })
  }

  return (
    <section aria-label="Dashboard filters" className="border-b border-slate-800 bg-slate-900/80">
      <div className="mx-auto flex max-w-7xl flex-wrap items-end gap-2 px-6 py-3">
        <label className="grid gap-1 text-[10px] uppercase tracking-wide text-slate-500">
          Stakeholder
          <select
            aria-label="Stakeholder"
            className={controlClass}
            value={value('stakeholder') || 'all'}
            onChange={(event) => {
              const next = new URLSearchParams(searchParams)
              if (event.target.value === 'all') next.delete('stakeholder')
              else next.set('stakeholder', event.target.value)
              setSearchParams(next, { replace: true })
            }}
          >
            {stakeholders.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-[10px] uppercase tracking-wide text-slate-500">
          Call type
          <select
            aria-label="Call type"
            className={controlClass}
            value={value('callType')}
            onChange={(event) => update('callType', event.target.value)}
          >
            {callTypes.map((item) => <option key={item.value || 'all'} value={item.value}>{item.label}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-[10px] uppercase tracking-wide text-slate-500">
          Product module
          <select
            aria-label="Product module"
            className={controlClass}
            value={value('module')}
            onChange={(event) => update('module', event.target.value)}
          >
            <option value="">All modules</option>
            {modules.map((module) => <option key={module} value={module}>{module}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-[10px] uppercase tracking-wide text-slate-500">
          Account
          <select
            aria-label="Account"
            className={controlClass}
            value={value('account')}
            onChange={(event) => update('account', event.target.value)}
          >
            <option value="">All accounts</option>
            {accounts.map((account) => <option key={account} value={account}>{account}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-[10px] uppercase tracking-wide text-slate-500">
          From
          <input
            aria-label="Start date"
            className={controlClass}
            type="date"
            value={value('from')}
            onChange={(event) => update('from', event.target.value)}
          />
        </label>
        <label className="grid gap-1 text-[10px] uppercase tracking-wide text-slate-500">
          To
          <input
            aria-label="End date"
            className={controlClass}
            type="date"
            value={value('to')}
            onChange={(event) => update('to', event.target.value)}
          />
        </label>
        <button
          type="button"
          className="rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
          onClick={reset}
        >
          Clear filters
        </button>
        {meetings.isError ? <span className="text-xs text-rose-300">{meetings.error.message}</span> : null}
      </div>
    </section>
  )
}
