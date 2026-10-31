import { useQuery } from '@tanstack/react-query'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { api } from '../api'
import { CALL_COLORS, Card, Err, Loading, fmtSent } from '../lib'
import { useDashboardFilters } from '../useDashboardFilters'

export default function Sentiment() {
  const q = useQuery({ queryKey: ['sentiment'], queryFn: api.sentiment })
  const meetings = useQuery({ queryKey: ['meetings'], queryFn: api.meetings })
  const { apply: applyFilters, isFiltered } = useDashboardFilters()
  if (q.isPending || meetings.isPending) return <Loading />
  if (q.isError) return <Err error={q.error} />
  if (meetings.isError) return <Err error={meetings.error} />

  const filteredMeetings = applyFilters(meetings.data)
  const trendGroups = new Map<string, typeof filteredMeetings>()
  for (const meeting of filteredMeetings) {
    if (!meeting.week) continue
    const key = `${meeting.week}|${meeting.call_type}`
    trendGroups.set(key, [...(trendGroups.get(key) ?? []), meeting])
  }
  const trends = [...trendGroups.entries()].map(([key, group]) => {
    const [week, call_type] = key.split('|')
    const customer = group.filter((meeting) => meeting.customer_sentiment_mean !== null)
    return {
      week,
      call_type,
      mean_customer: customer.length
        ? customer.reduce((sum, meeting) => sum + (meeting.customer_sentiment_mean ?? 0), 0) / customer.length
        : null,
      mean_all: group.reduce((sum, meeting) => sum + meeting.utterance_sentiment_mean, 0) / group.length,
      n: group.length,
    }
  })
  const heatCells = new Map<string, number[]>()
  for (const meeting of filteredMeetings) {
    const value = meeting.customer_sentiment_mean ?? meeting.utterance_sentiment_mean
    for (const module of meeting.product_modules) {
      const key = `${module}|${meeting.call_type}`
      heatCells.set(key, [...(heatCells.get(key) ?? []), value])
    }
  }
  const weeks = [...new Set(trends.map((t) => t.week))].sort()
  const lineData = weeks.map((week) => {
    const row: Record<string, string | number | null> = { week }
    for (const t of trends.filter((x) => x.week === week)) {
      row[t.call_type] = t.mean_customer ?? t.mean_all
    }
    return row
  })

  const modules = [...new Set([...heatCells.keys()].map((key) => key.split('|')[0]))]
  const types = ['support', 'external', 'internal']

  const traj = { recovering: 0, deteriorating: 0, flat: 0 }
  for (const m of filteredMeetings) {
    const key = m.sentiment_trajectory as keyof typeof traj
    if (key in traj) traj[key] += 1
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Sentiment</h1>
        <p className="mt-1 text-sm text-slate-400">
          Not the vendor summary score. Duration-weighted utterance polarity, customer-side on
          support and external calls, so Aegis politeness does not hide the ticket.
        </p>
        <p aria-live="polite" className="mt-2 text-xs text-slate-500">
          Showing {filteredMeetings.length} meetings{isFiltered ? ' matching dashboard filters' : ''}.
        </p>
      </div>

      <Card title="Weekly customer polarity by call type">
        <div className="h-80">
          <ResponsiveContainer>
            <LineChart data={lineData}>
              <CartesianGrid stroke="#1e293b" />
              <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis domain={[-1, 1]} tick={{ fill: '#94a3b8' }} />
              <Tooltip />
              <Legend />
              {types.map((t) => (
                <Line key={t} type="monotone" dataKey={t} stroke={CALL_COLORS[t]} dot={false} connectNulls />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Module × call type (mean polarity)">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase text-slate-500">
                <th className="py-1 text-left">Module</th>
                {types.map((t) => (
                  <th key={t} className="text-right capitalize">
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((mod) => (
                <tr key={mod} className="border-t border-slate-800">
                  <td className="py-2 capitalize">{mod}</td>
                  {types.map((t) => {
                    const values = heatCells.get(`${mod}|${t}`)
                    const v = values?.length
                      ? values.reduce((sum, value) => sum + value, 0) / values.length
                      : undefined
                    const bg =
                      v === undefined ? '' : v < -0.15 ? 'text-rose-300' : v > 0.15 ? 'text-emerald-300' : 'text-slate-300'
                    return (
                      <td key={t} className={`py-2 text-right ${bg}`}>
                        {fmtSent(v)}
                        {values ? <span className="ml-1 text-[10px] text-slate-500">n={values.length}</span> : null}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Call trajectory + interpretation">
          <p className="mb-3 text-sm text-slate-300">
            Recovering {traj.recovering} · Flat {traj.flat} · Deteriorating {traj.deteriorating}
          </p>
          {isFiltered ? (
            <p className="mb-2 text-xs text-slate-500">Narrative takeaways below summarize the unfiltered corpus.</p>
          ) : null}
          <ul className="space-y-2 text-sm text-slate-300">
            {q.data.takeaways.map((t) => (
              <li key={t} className="border-l-2 border-amber-700 pl-3">
                {t}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
