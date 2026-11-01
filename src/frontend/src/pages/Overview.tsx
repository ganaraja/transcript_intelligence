import { useQuery } from '@tanstack/react-query'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { api } from '../api'
import { AccountLink, Badge, CALL_COLORS, Card, Err, Loading } from '../lib'
import { useDashboardFilters } from '../useDashboardFilters'

export default function Overview() {
  const overview = useQuery({ queryKey: ['overview'], queryFn: api.overview })
  const provenance = useQuery({ queryKey: ['provenance'], queryFn: api.provenance })
  const voc = useQuery({ queryKey: ['voc'], queryFn: api.voc })
  const risk = useQuery({ queryKey: ['risk'], queryFn: api.risk })
  const meetings = useQuery({ queryKey: ['meetings'], queryFn: api.meetings })
  const { apply: applyFilters, isFiltered } = useDashboardFilters()

  if (overview.isPending || meetings.isPending) return <Loading />
  if (overview.isError) return <Err error={overview.error} />
  if (meetings.isError) return <Err error={meetings.error} />
  const data = overview.data
  const filteredMeetings = applyFilters(meetings.data)
  const callTypeMix = filteredMeetings.reduce<Record<string, number>>((counts, meeting) => {
    counts[meeting.call_type] = (counts[meeting.call_type] ?? 0) + 1
    return counts
  }, {})
  const meanPolarity = filteredMeetings.length
    ? filteredMeetings.reduce((sum, meeting) => sum + meeting.utterance_sentiment_mean, 0) / filteredMeetings.length
    : 0
  const riskAccounts = new Set(
    filteredMeetings
      .filter((meeting) => meeting.risk_score >= 0.5 && meeting.call_type !== 'internal')
      .map((meeting) => meeting.customer_name ?? meeting.meeting_id),
  )
  const filteredRiskRows = (risk.data ?? [])
    .map((row) => {
      const associated = row.meeting_ids
        .map((id) => filteredMeetings.find((meeting) => meeting.meeting_id === id))
        .filter((meeting) => meeting !== undefined)
      if (!associated.length) return null
      return {
        ...row,
        risk_score: Math.max(...associated.map((meeting) => meeting.risk_score)),
        risk_flags: [...new Set(associated.flatMap((meeting) => meeting.risk_flags))],
        mean_customer_sentiment: (() => {
          const scores = associated
            .map((meeting) => meeting.customer_sentiment_mean)
            .filter((score): score is number => score !== null)
          return scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null
        })(),
      }
    })
    .filter((row) => row !== null)
    .sort((a, b) => b.risk_score - a.risk_score)
  const pie = Object.entries(callTypeMix).map(([name, value]) => ({ name, value }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Aegis Cloud — 100 calls, one early-warning system</h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-400">
          Hybrid pipeline: rules for call type, keyword taxonomy for themes, duration-weighted
          customer sentiment. Three extras: risk radar, cross-surface issue graph, VOC backlog.
        </p>
        <p aria-live="polite" className="mt-2 text-xs text-slate-500">
          Showing {filteredMeetings.length} of {meetings.data.length} meetings
          {isFiltered ? ' matching dashboard filters' : ''}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['Meetings', String(filteredMeetings.length)],
          ['Support / AM / Internal', `${callTypeMix.support ?? 0} / ${callTypeMix.external ?? 0} / ${callTypeMix.internal ?? 0}`],
          ['Mean polarity', meanPolarity.toFixed(2)],
          ['High-risk accounts', String(riskAccounts.size)],
        ].map(([k, v]) => (
          <Card key={k}>
            <div className="text-xs uppercase tracking-wide text-slate-500">{k}</div>
            <div className="mt-1 text-xl font-semibold">{v}</div>
          </Card>
        ))}
      </div>

      {provenance.isError ? <Err error={provenance.error} /> : null}
      {provenance.data ? (
        <Card title="Data and run provenance">
          <div className="grid gap-3 text-sm text-slate-300 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Generated</div>
              <div>{new Date(provenance.data.generated_at).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Pipeline</div>
              <div>
                v{provenance.data.pipeline_version} · commit {provenance.data.git_revision?.slice(0, 12) ?? 'unavailable'}
                {provenance.data.code.working_tree_clean ? '' : ' · working tree changed'}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Input corpus</div>
              <div>
                {provenance.data.dataset.meeting_count} meetings · {provenance.data.dataset.source_file_count} source files
              </div>
              <div className="break-all font-mono text-xs text-slate-500">
                SHA-256 {provenance.data.dataset.sha256}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Enrichment</div>
              <div>
                {provenance.data.configuration.llm_refinement_enabled
                  ? `LLM enabled · ${provenance.data.configuration.llm_model ?? 'model not set'} · prompt ${provenance.data.configuration.llm_prompt_version}`
                  : 'Rules-only theme refinement'}
              </div>
              <div className="text-xs text-slate-500">
                Refinement applied:{' '}
                {Object.values(provenance.data.theme_refinement_counts).reduce((sum, count) => sum + count, 0)} meetings
                {Object.entries(provenance.data.theme_refinement_counts).length
                  ? ` (${Object.entries(provenance.data.theme_refinement_counts)
                      .map(([source, count]) => `${count} ${source}`)
                      .join(', ')})`
                  : ' (none)'}
                {provenance.data.configuration.llm_refinement_enabled && !provenance.data.configuration.llm_api_key_configured
                  ? ' · API key not configured'
                  : ''}
              </div>
            </div>
          </div>
          <details className="mt-3 text-xs text-slate-400">
            <summary className="cursor-pointer">Inspect source file hashes ({provenance.data.dataset.source_files.length})</summary>
            <ul className="mt-2 max-h-48 space-y-1 overflow-auto font-mono">
              {provenance.data.dataset.source_files.map((source) => (
                <li key={source.path} className="break-all">{source.path} · {source.sha256}</li>
              ))}
            </ul>
          </details>
          <p className="mt-2 text-xs text-slate-500">
            Inputs are not independently verified. The pipeline does not generate synthetic transcripts or augment the dataset.
          </p>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Call type mix (rule-based)">
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pie} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} label>
                  {pie.map((d) => (
                    <Cell key={d.name} fill={CALL_COLORS[d.name] || '#64748b'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500">{data.approach.call_type}</p>
        </Card>
        <Card title="What the numbers mean">
          {isFiltered ? <p className="mb-2 text-xs text-slate-500">Narrative takeaways summarize the unfiltered corpus.</p> : null}
          <ul className="space-y-2 text-sm text-slate-300">
            {data.takeaways.map((t) => (
              <li key={t} className="border-l-2 border-sky-700 pl-3">
                {t}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Voice-of-customer backlog (product)">
        {isFiltered ? <p className="mb-2 text-xs text-slate-500">VOC group counts summarize the unfiltered corpus.</p> : null}
        <div className="grid gap-3 md:grid-cols-2">
          {(voc.data ?? []).slice(0, 6).map((row) => (
            <div key={`${row.voc_type}-${row.module}`} className="rounded-lg border border-slate-800 p-3">
              <div className="mb-1 flex items-center gap-2">
                <Badge>{row.voc_type}</Badge>
                <span className="text-sm text-slate-300">{row.module ?? 'platform'}</span>
                <span className="ml-auto text-xs text-slate-500">{row.count} calls</span>
              </div>
              <p className="text-xs text-slate-400">{row.why_it_matters}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Top risk accounts (sales + support)">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="py-2">Account</th>
                <th>Score</th>
                <th>Flags</th>
                <th>Customer sentiment</th>
              </tr>
            </thead>
            <tbody>
              {filteredRiskRows.slice(0, 8).map((r) => (
                <tr key={r.account} className="border-t border-slate-800">
                  <td className="py-2"><AccountLink account={r.account} /></td>
                  <td>{r.risk_score.toFixed(2)}</td>
                  <td className="space-x-1">
                    {r.risk_flags.map((f) => (
                      <Badge key={f} tone="rose">
                        {f}
                      </Badge>
                    ))}
                  </td>
                  <td>{r.mean_customer_sentiment?.toFixed(2) ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
