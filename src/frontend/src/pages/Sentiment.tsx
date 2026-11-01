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
import { CALL_COLORS, Card, Err, Loading, MeetingLink, fmtSent } from '../lib'
import { SampleSizeNotice } from '../components/SampleSizeNotice'
import type { CallType } from '../types'
import { useDashboardFilters } from '../useDashboardFilters'

const callTypes: CallType[] = ['support', 'external', 'internal']
const trajectoryTypes = ['recovering', 'flat', 'deteriorating'] as const
type Trajectory = (typeof trajectoryTypes)[number]
type Polarity = 'positive' | 'neutral' | 'negative'

const providedPolarity: Record<string, Polarity> = {
  'very-positive': 'positive',
  positive: 'positive',
  'mixed-positive': 'positive',
  neutral: 'neutral',
  'mixed-negative': 'negative',
  negative: 'negative',
  'very-negative': 'negative',
}

function classifyPolarity(score: number): Polarity {
  if (score < -0.15) return 'negative'
  if (score > 0.15) return 'positive'
  return 'neutral'
}

const trajectoryLabels: Record<Trajectory, string> = {
  recovering: 'Recovering',
  flat: 'Flat',
  deteriorating: 'Deteriorating',
}
const trajectoryColors: Record<Trajectory, string> = {
  recovering: '#34d399',
  flat: '#facc15',
  deteriorating: '#dc2626',
}

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
      n: customer.length || group.length,
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
  const types = callTypes

  const trajectoryRows = callTypes.map((callType) => {
    const calls = filteredMeetings.filter((meeting) => meeting.call_type === callType)
    const counts = Object.fromEntries(
      trajectoryTypes.map((trajectory) => [
        trajectory,
        calls.filter((meeting) => meeting.sentiment_trajectory === trajectory).length,
      ]),
    ) as Record<Trajectory, number>
    return {
      callType,
      total: calls.length,
      counts,
      percentages: Object.fromEntries(
        trajectoryTypes.map((trajectory) => [
          trajectory,
          calls.length ? (counts[trajectory] / calls.length) * 100 : 0,
        ]),
      ) as Record<Trajectory, number>,
    }
  })
  const trajectoryTotals = Object.fromEntries(
    trajectoryTypes.map((trajectory) => [
      trajectory,
      trajectoryRows.reduce((total, row) => total + row.counts[trajectory], 0),
    ]),
  ) as Record<Trajectory, number>
  const sentimentComparisons = filteredMeetings.flatMap((meeting) => {
    const providedLabel = meeting.provided_overall_sentiment?.trim().toLowerCase()
    const provided =
      providedLabel && Object.hasOwn(providedPolarity, providedLabel)
        ? providedPolarity[providedLabel]
        : undefined
    if (!provided || meeting.utterance_count === 0) return []
    const computed = classifyPolarity(meeting.utterance_sentiment_mean)
    return [{ meeting, provided, computed, agrees: provided === computed }]
  })
  const agreementRows = callTypes.map((callType) => {
    const comparisons = sentimentComparisons.filter((item) => item.meeting.call_type === callType)
    const aligned = comparisons.filter((item) => item.agrees).length
    return {
      callType,
      compared: comparisons.length,
      aligned,
      conflicts: comparisons.length - aligned,
      alignmentRate: comparisons.length ? (aligned / comparisons.length) * 100 : 0,
    }
  })
  const alignedTotal = sentimentComparisons.filter((item) => item.agrees).length
  const conflictRows = sentimentComparisons.filter((item) => !item.agrees)
  const lowSampleTrends = trends.filter((trend) => trend.n > 0 && trend.n < 5)

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
        {filteredMeetings.length > 0 && filteredMeetings.length < 5 ? (
          <div className="mt-2">
            <SampleSizeNotice sampleSize={filteredMeetings.length} context="Sentiment summaries" />
          </div>
        ) : null}
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
        {lowSampleTrends.length ? (
          <div className="mt-3 flex flex-wrap gap-2" aria-label="Low-sample weekly sentiment groups">
            {lowSampleTrends.map((trend) => (
              <SampleSizeNotice
                key={`${trend.week}-${trend.call_type}`}
                sampleSize={trend.n}
                context={`${trend.call_type} sentiment in week of ${trend.week}`}
                compact
              />
            ))}
          </div>
        ) : null}
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
                        {values && values.length > 0 && values.length < 5 ? (
                          <span className="ml-1">
                            <SampleSizeNotice
                              sampleSize={values.length}
                              context={`${mod} ${t} sentiment`}
                              compact
                            />
                          </span>
                        ) : null}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Call trajectory + interpretation">
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

        <Card title="Provided label vs utterance-level sentiment" className="lg:col-span-2">
          <p className="mb-4 max-w-3xl text-sm leading-relaxed text-slate-400">
            Polarity-level consistency check between the provided meeting label and the duration-weighted
            utterance score. Mixed labels map to their positive or negative direction; scores from -0.15
            to 0.15 count as neutral. This is not an independent model evaluation or an accuracy measure.
          </p>
          {agreementRows.some((row) => row.compared > 0 && row.compared < 5) ? (
            <p className="mb-3 text-xs text-amber-200/90">
              Call-type alignment rates based on fewer than 5 meetings are descriptive, not conclusive.
            </p>
          ) : null}
          <div className="mb-4 flex flex-wrap gap-3 text-xs">
            <span className="rounded-full border border-emerald-900/70 bg-emerald-950/40 px-3 py-1.5 text-emerald-300">
              {alignedTotal} aligned
            </span>
            <span className="rounded-full border border-rose-900/70 bg-rose-950/40 px-3 py-1.5 text-rose-300">
              {conflictRows.length} conflicts
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-slate-300">
              {sentimentComparisons.length} compared
            </span>
            {filteredMeetings.length > sentimentComparisons.length ? (
              <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-slate-400">
                {filteredMeetings.length - sentimentComparisons.length} not compared
              </span>
            ) : null}
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table aria-label="Sentiment agreement by call type" className="w-full min-w-[32rem] text-sm">
              <thead className="bg-slate-950/70 text-[11px] uppercase tracking-wide text-slate-400">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left">Call type</th>
                  <th scope="col" className="px-3 py-3 text-right">Compared</th>
                  <th scope="col" className="px-3 py-3 text-right">Aligned</th>
                  <th scope="col" className="px-3 py-3 text-right">Conflicts</th>
                  <th scope="col" className="px-4 py-3 text-right">Alignment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {agreementRows.map((row) => (
                  <tr key={row.callType} className="text-slate-300">
                    <th scope="row" className="px-4 py-3 text-left font-medium capitalize text-slate-200">
                      {row.callType}
                      {row.compared > 0 ? (
                        <span className="ml-1 align-middle">
                          <SampleSizeNotice sampleSize={row.compared} context={`${row.callType} sentiment agreement`} compact />
                        </span>
                      ) : null}
                    </th>
                    <td className="px-3 py-3 text-right tabular-nums">{row.compared}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-emerald-300">{row.aligned}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-rose-300">{row.conflicts}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {row.compared ? `${row.alignmentRate.toFixed(1)}%` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-slate-700 bg-slate-950/50">
                <tr className="font-semibold text-slate-100">
                  <th scope="row" className="px-4 py-3 text-left">All types</th>
                  <td className="px-3 py-3 text-right tabular-nums">{sentimentComparisons.length}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-emerald-300">{alignedTotal}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-rose-300">{conflictRows.length}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {sentimentComparisons.length
                      ? `${((alignedTotal / sentimentComparisons.length) * 100).toFixed(1)}%`
                      : '—'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="mt-5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Calls with conflicting polarity ({conflictRows.length})
            </h3>
            {conflictRows.length ? (
              <div className="max-h-80 overflow-auto rounded-lg border border-slate-800">
                <table aria-label="Sentiment polarity conflicts" className="w-full min-w-[38rem] text-sm">
                  <thead className="sticky top-0 bg-slate-950 text-[11px] uppercase tracking-wide text-slate-400">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left">Call</th>
                      <th scope="col" className="px-3 py-3 text-left">Call type</th>
                      <th scope="col" className="px-3 py-3 text-left">Provided label</th>
                      <th scope="col" className="px-4 py-3 text-right">Utterance score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {conflictRows.map(({ meeting, computed }) => (
                      <tr key={meeting.meeting_id} className="text-slate-300">
                        <td className="px-4 py-3"><MeetingLink id={meeting.meeting_id} title={meeting.title} /></td>
                        <td className="px-3 py-3 capitalize">{meeting.call_type}</td>
                        <td className="px-3 py-3">{meeting.provided_overall_sentiment}</td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          <span className="capitalize">{computed}</span> ({fmtSent(meeting.utterance_sentiment_mean)})
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-sm text-slate-400">
                No conflicting calls in this selection.
              </p>
            )}
          </div>
        </Card>
      </div>

      <Card title="Trajectory distribution by call type">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <p className="max-w-2xl text-sm leading-relaxed text-slate-400">
            Share of calls whose sentiment recovered, stayed flat, or deteriorated from the first to
            last third of the transcript. A recovering trajectory does not confirm issue resolution.
          </p>
          <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs font-medium text-slate-300">
            {filteredMeetings.length} {filteredMeetings.length === 1 ? 'call' : 'calls'}
          </span>
        </div>

        <div aria-label="Trajectory chart legend" className="mb-4 flex flex-wrap gap-x-5 gap-y-2">
          {trajectoryTypes.map((trajectory) => (
            <span key={trajectory} className="inline-flex items-center gap-2 text-xs text-slate-300">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: trajectoryColors[trajectory] }}
              />
              {trajectoryLabels[trajectory]}
            </span>
          ))}
        </div>

        <div
          aria-label="Sentiment trajectory composition by call type"
          className="space-y-4 rounded-lg border border-slate-800 bg-slate-950/40 p-4"
          role="group"
        >
          {trajectoryRows.map((row) => (
            <div key={row.callType} className="grid gap-2 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-center sm:gap-4">
              <div className="flex items-center justify-between gap-3 sm:block">
                <p className="text-sm font-medium capitalize text-slate-200">{row.callType}</p>
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  {row.total} {row.total === 1 ? 'call' : 'calls'}
                  {row.total > 0 ? (
                    <SampleSizeNotice sampleSize={row.total} context={`${row.callType} trajectory distribution`} compact />
                  ) : null}
                </p>
              </div>
              {row.total ? (
                <div
                  aria-label={`${row.callType}: ${trajectoryTypes.map((trajectory) =>
                    `${row.counts[trajectory]} ${trajectoryLabels[trajectory].toLowerCase()} (${row.percentages[trajectory].toFixed(1)}%)`,
                  ).join(', ')}`}
                  className="flex h-10 overflow-hidden rounded-full border border-slate-700/70 bg-slate-950/80 p-1 shadow-inner shadow-black/50"
                  role="img"
                >
                  {trajectoryTypes
                    .filter((trajectory) => row.counts[trajectory] > 0)
                    .map((trajectory, index, visibleTrajectories) => {
                      const percentage = row.percentages[trajectory]
                      const isRed = trajectory === 'deteriorating'
                      return (
                        <div
                          key={trajectory}
                          className={`relative flex min-w-0 items-center justify-center overflow-hidden text-[11px] font-semibold tracking-wide transition-[flex-grow] duration-300 ${
                            isRed ? 'text-white' : 'text-slate-950'
                          } ${index === 0 ? 'rounded-l-full' : 'border-l border-white/35'} ${
                            index === visibleTrajectories.length - 1 ? 'rounded-r-full' : ''
                          }`}
                          style={{
                            flexBasis: 0,
                            flexGrow: row.counts[trajectory],
                            backgroundColor: trajectoryColors[trajectory],
                          }}
                          title={`${trajectoryLabels[trajectory]}: ${row.counts[trajectory]} calls (${percentage.toFixed(1)}%)`}
                        >
                          <span className="relative z-10 flex flex-col items-center leading-tight drop-shadow-sm">
                            {percentage >= 12 ? <span>{percentage.toFixed(0)}%</span> : null}
                            {percentage >= 25 ? (
                              <span className="text-[10px] font-medium opacity-80">
                                {row.counts[trajectory]} {row.counts[trajectory] === 1 ? 'call' : 'calls'}
                              </span>
                            ) : null}
                          </span>
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10"
                          />
                        </div>
                      )
                    })}
                </div>
              ) : (
                <p className="flex h-9 items-center rounded-md border border-dashed border-slate-700 px-3 text-xs text-slate-500">
                  No calls in this selection
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 overflow-x-auto rounded-lg border border-slate-800">
          <table aria-label="Trajectory distribution by call type" className="w-full min-w-[36rem] text-sm">
            <thead className="bg-slate-950/70 text-[11px] uppercase tracking-wide text-slate-400">
              <tr>
                <th scope="col" className="px-4 py-3 text-left">Call type</th>
                {trajectoryTypes.map((trajectory) => (
                  <th scope="col" key={trajectory} className="px-3 py-3 text-right">
                    <span className="inline-flex items-center justify-end gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: trajectoryColors[trajectory] }} />
                      {trajectoryLabels[trajectory]}
                    </span>
                  </th>
                ))}
                <th scope="col" className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {trajectoryRows.map((row) => (
                <tr key={row.callType} className="text-slate-300 transition-colors hover:bg-white/[0.025]">
                  <th scope="row" className="px-4 py-3 text-left font-medium capitalize text-slate-200">{row.callType}</th>
                  {trajectoryTypes.map((trajectory) => (
                    <td key={trajectory} className="px-3 py-3 text-right tabular-nums">
                      <span className="font-medium">{row.counts[trajectory]}</span>
                      {' '}
                      <span className="text-xs text-slate-500">({row.percentages[trajectory].toFixed(1)}%)</span>
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right font-semibold tabular-nums text-slate-100">{row.total}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-slate-700 bg-slate-950/50">
              <tr>
                <th scope="row" className="px-4 py-3 text-left font-semibold text-slate-100">All types</th>
                {trajectoryTypes.map((trajectory) => {
                  const percentage = filteredMeetings.length
                    ? (trajectoryTotals[trajectory] / filteredMeetings.length) * 100
                    : 0
                  return (
                    <td key={trajectory} className="px-3 py-3 text-right tabular-nums text-slate-200">
                      <span className="font-semibold">{trajectoryTotals[trajectory]}</span>
                      {' '}
                      <span className="text-xs text-slate-500">({percentage.toFixed(1)}%)</span>
                    </td>
                  )
                })}
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-slate-100">{filteredMeetings.length}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  )
}
