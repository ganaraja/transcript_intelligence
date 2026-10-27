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

export default function Sentiment() {
  const q = useQuery({ queryKey: ['sentiment'], queryFn: api.sentiment })
  const meetings = useQuery({ queryKey: ['meetings'], queryFn: api.meetings })
  if (q.isPending) return <Loading />
  if (q.isError) return <Err error={q.error} />

  const weeks = [...new Set(q.data.trends.map((t) => t.week))].sort()
  const lineData = weeks.map((week) => {
    const row: Record<string, string | number | null> = { week }
    for (const t of q.data.trends.filter((x) => x.week === week)) {
      row[t.call_type] = t.mean_customer ?? t.mean_all
    }
    return row
  })

  const modules = [...new Set(q.data.heatmap.map((h) => h.module))]
  const types = ['support', 'external', 'internal']

  const traj = { recovering: 0, deteriorating: 0, flat: 0 }
  for (const m of meetings.data ?? []) {
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
                    const cell = q.data.heatmap.find((h) => h.module === mod && h.call_type === t)
                    const v = cell?.mean
                    const bg =
                      v === undefined ? '' : v < -0.15 ? 'text-rose-300' : v > 0.15 ? 'text-emerald-300' : 'text-slate-300'
                    return (
                      <td key={t} className={`py-2 text-right ${bg}`}>
                        {fmtSent(v)}
                        {cell ? <span className="ml-1 text-[10px] text-slate-500">n={cell.n}</span> : null}
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
