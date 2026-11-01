import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { api } from '../api'
import { Badge, Card, ConfidenceBadge, Err, Loading, MeetingLink } from '../lib'
import { SampleSizeNotice } from '../components/SampleSizeNotice'
import { useDashboardFilters } from '../useDashboardFilters'

export default function Themes() {
  const themes = useQuery({ queryKey: ['themes'], queryFn: api.themes })
  const meetings = useQuery({ queryKey: ['meetings'], queryFn: api.meetings })
  const validation = useQuery({
    queryKey: ['taxonomy-validation'],
    queryFn: api.taxonomyValidation,
  })
  const { apply: applyFilters, isFiltered } = useDashboardFilters()
  const [selected, setSelected] = useState<string | null>(null)

  const filteredMeetings = useMemo(
    () => applyFilters(meetings.data ?? []),
    [applyFilters, meetings.data],
  )
  const filteredThemes = useMemo(
    () =>
      (themes.data ?? [])
        .map((theme) => {
          const themeMeetings = filteredMeetings.filter((meeting) => meeting.primary_theme === theme.theme_id)
          const byCallType = Object.fromEntries(
            ['support', 'external', 'internal'].map((type) => [
              type,
              themeMeetings.filter((meeting) => meeting.call_type === type).length,
            ]),
          )
          return { ...theme, count: themeMeetings.length, by_call_type: byCallType }
        })
        .filter((theme) => theme.count > 0),
    [filteredMeetings, themes.data],
  )

  const chart = useMemo(
    () =>
      filteredThemes.map((t) => ({
        name: t.label.replace(' / ', '\n'),
        label: t.label,
        theme_id: t.theme_id,
        support: t.by_call_type.support || 0,
        external: t.by_call_type.external || 0,
        internal: t.by_call_type.internal || 0,
      })),
    [filteredThemes],
  )

  if (themes.isPending || meetings.isPending || validation.isPending) return <Loading />
  if (themes.isError) return <Err error={themes.error} />
  if (validation.isError) return <Err error={validation.error} />

  const active =
    filteredThemes.find((t) => t.theme_id === selected) ??
    filteredThemes[0]
  const examples = filteredMeetings.filter((m) => active && m.primary_theme === active.theme_id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Themes</h1>
        <p className="mt-1 text-sm text-slate-400">
          Call type is rules. Primary theme is a title-weighted keyword taxonomy over summary
          topics and the transcript. Click a bar or row for examples — that is the evaluation
          requirement, not just a count.
        </p>
        <p aria-live="polite" className="mt-2 text-xs text-slate-500">
          Showing {filteredMeetings.length} of {meetings.data?.length ?? 0} meetings
          {isFiltered ? ' matching dashboard filters' : ''}.
        </p>
      </div>

      <Card title="Taxonomy validation pass">
        {isFiltered ? (
          <p className="mb-2 text-xs text-slate-500">Validation metrics summarize the unfiltered corpus.</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{validation.data?.status === 'passed' ? 'Passed' : 'Needs human review'}</Badge>
          <span className="text-sm text-slate-300">
            {validation.data?.pass_rate ? `${(validation.data.pass_rate * 100).toFixed(0)}%` : '0%'} theme-evidence pass rate
          </span>
        </div>
        <div className="mt-3 grid gap-3 text-sm text-slate-300 md:grid-cols-3">
          <div className="rounded border border-slate-800 bg-slate-900/60 p-3">
            <div className="text-slate-400">Reviewed meetings</div>
            <div className="mt-1 text-lg font-semibold">{validation.data?.reviewed_meetings ?? 0}</div>
          </div>
          <div className="rounded border border-slate-800 bg-slate-900/60 p-3">
            <div className="text-slate-400">Reviewed themes</div>
            <div className="mt-1 text-lg font-semibold">{validation.data?.reviewed_themes ?? 0}</div>
          </div>
          <div className="rounded border border-slate-800 bg-slate-900/60 p-3">
            <div className="text-slate-400">Needs review</div>
            <div className="mt-1 text-lg font-semibold">{validation.data?.needs_human_review ?? 0}</div>
          </div>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-400">
          {(validation.data?.criteria ?? []).map((criterion) => (
            <li key={criterion}>{criterion}</li>
          ))}
        </ul>
      </Card>

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
            {filteredThemes.map((t) => (
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
                  {t.count < 5 ? (
                    <span className="ml-2">
                      <SampleSizeNotice sampleSize={t.count} context={`${t.label} theme count`} compact />
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
          {!filteredThemes.length ? (
            <p className="text-sm text-slate-400">No themes match the current filters.</p>
          ) : null}
        </Card>
        <Card title={active ? `${active.label} — examples` : 'Examples'} className="lg:col-span-2">
          {active ? <p className="mb-3 text-xs text-slate-500">{active.rationale}</p> : null}
          {active && examples.length > 0 && examples.length < 5 ? (
            <div className="mb-3">
              <SampleSizeNotice sampleSize={examples.length} context={`${active.label} theme`} />
            </div>
          ) : null}
          <div className="space-y-3">
            {examples.slice(0, 6).map((m) => (
              <div key={m.meeting_id} className="rounded-lg border border-slate-800 p-3">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <Badge>{m.call_type}</Badge>
                  <ConfidenceBadge signal={m.confidence.theme} />
                  <MeetingLink id={m.meeting_id} title={m.title} />
                </div>
                <p className="text-xs italic text-slate-400">“{m.example_quote || m.summary.slice(0, 220)}”</p>
              </div>
            ))}
            {!examples.length ? (
              <p className="text-sm text-slate-400">No meeting examples match the current filters.</p>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  )
}
