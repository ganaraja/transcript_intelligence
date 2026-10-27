import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { api } from '../api'
import { Badge, Card, Err, Loading, MeetingLink } from '../lib'

export default function Themes() {
  const themes = useQuery({ queryKey: ['themes'], queryFn: api.themes })
  const meetings = useQuery({ queryKey: ['meetings'], queryFn: api.meetings })
  const [selected, setSelected] = useState<string | null>(null)

  const chart = useMemo(
    () =>
      (themes.data ?? []).map((t) => ({
        name: t.label.replace(' / ', '\n'),
        label: t.label,
        theme_id: t.theme_id,
        support: t.by_call_type.support || 0,
        external: t.by_call_type.external || 0,
        internal: t.by_call_type.internal || 0,
      })),
    [themes.data],
  )

  if (themes.isPending || meetings.isPending) return <Loading />
  if (themes.isError) return <Err error={themes.error} />

  const active = (themes.data ?? []).find((t) => t.theme_id === (selected || themes.data?.[0]?.theme_id))
  const examples = (meetings.data ?? []).filter((m) => active && m.primary_theme === active.theme_id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Themes</h1>
        <p className="mt-1 text-sm text-slate-400">
          Call type is rules. Primary theme is a title-weighted keyword taxonomy over summary
          topics and the transcript. Click a bar or row for examples — that is the evaluation
          requirement, not just a count.
        </p>
      </div>
      <Card title="Primary theme × call type">
        <div className="h-80">
          <ResponsiveContainer>
            <BarChart
              data={chart}
              onClick={(state) => {
                const id = (state as { activePayload?: Array<{ payload: { theme_id: string } }> })
                  .activePayload?.[0]?.payload.theme_id
                if (id) setSelected(id)
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={0} angle={-25} textAnchor="end" height={80} />
              <YAxis tick={{ fill: '#94a3b8' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="support" stackId="a" fill="#f59e0b" />
              <Bar dataKey="external" stackId="a" fill="#38bdf8" />
              <Bar dataKey="internal" stackId="a" fill="#a78bfa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Codebook" className="lg:col-span-1">
          <ul className="space-y-1 text-sm">
            {(themes.data ?? []).map((t) => (
              <li key={t.theme_id}>
                <button
                  type="button"
                  onClick={() => setSelected(t.theme_id)}
                  className={`w-full rounded px-2 py-1 text-left ${
                    active?.theme_id === t.theme_id ? 'bg-slate-800' : 'hover:bg-slate-800/60'
                  }`}
                >
                  <span className="font-medium">{t.label}</span>
                  <span className="float-right text-slate-500">{t.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
        <Card title={active ? `${active.label} — examples` : 'Examples'} className="lg:col-span-2">
          {active ? <p className="mb-3 text-xs text-slate-500">{active.rationale}</p> : null}
          <div className="space-y-3">
            {examples.slice(0, 6).map((m) => (
              <div key={m.meeting_id} className="rounded-lg border border-slate-800 p-3">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <Badge>{m.call_type}</Badge>
                  <MeetingLink id={m.meeting_id} title={m.title} />
                </div>
                <p className="text-xs italic text-slate-400">“{m.example_quote || m.summary.slice(0, 220)}”</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
