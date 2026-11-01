import { useQuery } from '@tanstack/react-query'
import { api } from '../api'
import { AccountLink, Badge, Card, ConfidenceBadge, Err, Loading, MeetingLink, fmtSent } from '../lib'
import { useDashboardFilters } from '../useDashboardFilters'

export default function Accounts() {
  const risk = useQuery({ queryKey: ['risk'], queryFn: api.risk })
  const meetings = useQuery({ queryKey: ['meetings'], queryFn: api.meetings })
  const { apply: applyFilters, isFiltered } = useDashboardFilters()
  if (risk.isPending || meetings.isPending) return <Loading />
  if (risk.isError) return <Err error={risk.error} />
  if (meetings.isError) return <Err error={meetings.error} />
  const filteredMeetings = applyFilters(meetings.data)
  const byId = Object.fromEntries(filteredMeetings.map((m) => [m.meeting_id, m]))
  const filteredRiskRows = risk.data
    .map((row) => {
      const associated = row.meeting_ids
        .map((id) => byId[id])
        .filter((meeting) => meeting !== undefined)
      if (!associated.length) return null
      const highestRisk = associated.reduce((highest, meeting) =>
        meeting.risk_score > highest.risk_score ? meeting : highest,
      )
      const customerSentiments = associated
        .map((meeting) => meeting.customer_sentiment_mean)
        .filter((value): value is number => value !== null)
      return {
        ...row,
        meetings: associated.length,
        meeting_ids: associated.map((meeting) => meeting.meeting_id),
        risk_score: highestRisk.risk_score,
        confidence: highestRisk.confidence.risk,
        risk_flags: [...new Set(associated.flatMap((meeting) => meeting.risk_flags))].sort(),
        call_types: [...new Set(associated.map((meeting) => meeting.call_type))].sort(),
        themes: [...new Set(associated.map((meeting) => meeting.primary_theme_label))].sort(),
        competitors: [...new Set(associated.flatMap((meeting) => meeting.competitor_mentions))].sort(),
        mean_customer_sentiment: customerSentiments.length
          ? customerSentiments.reduce((sum, value) => sum + value, 0) / customerSentiments.length
          : null,
      }
    })
    .filter((row) => row !== null)
    .sort((a, b) => b.risk_score - a.risk_score || b.meetings - a.meetings)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Risk radar</h1>
        <p className="mt-1 text-sm text-slate-400">
          Composite of churn key-moments, competitor mentions, urgent titles, and customer-side
          negativity. Sales and support should share one list — not two CRMs.
        </p>
        <p aria-live="polite" className="mt-2 text-xs text-slate-500">
          Showing {filteredRiskRows.length} accounts from {filteredMeetings.length} matching meetings
          {isFiltered ? ' matching dashboard filters' : ''}.
        </p>
        {isFiltered ? (
          <p className="mt-1 text-xs text-slate-500">
            Scores and flags use matching meetings; account explanations summarize the corpus-wide risk rules.
          </p>
        ) : null}
      </div>
      {filteredRiskRows.map((row) => (
        <Card key={row.account} title={`${row.account} · score ${row.risk_score.toFixed(2)}`}>
          <p className="mb-2 text-sm">
            <AccountLink account={row.account} label="View account details" />
          </p>
          <p className="mb-2 text-sm text-slate-300">{row.why_it_matters}</p>
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
            Risk-rule confidence:
            <ConfidenceBadge signal={row.confidence} />
          </div>
          <p className="mb-2 text-xs text-slate-500">{row.confidence.evidence.join(' ')}</p>
          <div className="mb-2 flex flex-wrap gap-1">
            {row.risk_flags.map((f) => (
              <Badge key={f} tone="rose">
                {f}
              </Badge>
            ))}
            {row.competitors.map((c) => (
              <Badge key={c} tone="amber">
                {c}
              </Badge>
            ))}
            <span className="text-xs text-slate-500">customer sentiment {fmtSent(row.mean_customer_sentiment)}</span>
          </div>
          <ul className="space-y-1 text-sm">
            {row.meeting_ids.map((id) => {
              const m = byId[id]
              return (
                <li key={id}>
                  {m ? (
                    <>
                      <Badge>{m.call_type}</Badge>{' '}
                      <MeetingLink id={id} title={m.title} />
                    </>
                  ) : (
                    id
                  )}
                </li>
              )
            })}
          </ul>
        </Card>
      ))}
      {!filteredRiskRows.length ? (
        <p className="text-sm text-slate-400">No risk accounts match the current filters.</p>
      ) : null}
    </div>
  )
}
