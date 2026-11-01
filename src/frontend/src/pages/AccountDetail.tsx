import { useQuery } from '@tanstack/react-query'
import { Link, useLocation, useParams } from 'react-router-dom'
import { api } from '../api'
import { useDashboardFilters } from '../useDashboardFilters'
import { Badge, Card, ConfidenceBadge, Err, Loading, MeetingLink, fmtSent } from '../lib'

export default function AccountDetail() {
  const { account = '' } = useParams()
  const location = useLocation()
  const risk = useQuery({ queryKey: ['risk'], queryFn: api.risk })
  const meetings = useQuery({ queryKey: ['meetings'], queryFn: api.meetings })
  const { apply: applyFilters, isFiltered } = useDashboardFilters()

  if (risk.isPending || meetings.isPending) return <Loading />
  if (risk.isError) return <Err error={risk.error} />
  if (meetings.isError) return <Err error={meetings.error} />

  const riskRow = risk.data.find((row) => row.account === account)
  const accountMeetingIds = new Set(riskRow?.meeting_ids ?? [])
  const matchingMeetings = applyFilters(meetings.data)
    .filter((meeting) =>
      riskRow
        ? accountMeetingIds.has(meeting.meeting_id)
        : (meeting.customer_name ?? meeting.meeting_id) === account,
    )
    .sort((a, b) => (b.start_time ?? '').localeCompare(a.start_time ?? ''))

  if (!matchingMeetings.length) {
    return (
      <div className="space-y-4">
        <Link to={`/accounts${location.search}`} className="text-sm text-sky-300 hover:underline">
          ← Back to Risk radar
        </Link>
        <h1 className="text-2xl font-semibold">{account}</h1>
        <p className="text-sm text-slate-400">
          No account meetings match the current filters, or this account is not in the dataset.
        </p>
      </div>
    )
  }

  const highestRiskMeeting = matchingMeetings.reduce((highest, meeting) =>
    meeting.risk_score > highest.risk_score ? meeting : highest,
  )
  const customerSentiments = matchingMeetings
    .map((meeting) => meeting.customer_sentiment_mean)
    .filter((sentiment): sentiment is number => sentiment !== null)
  const meanCustomerSentiment = customerSentiments.length
    ? customerSentiments.reduce((sum, sentiment) => sum + sentiment, 0) / customerSentiments.length
    : null
  const riskFlags = [...new Set(matchingMeetings.flatMap((meeting) => meeting.risk_flags))].sort()
  const competitors = [...new Set(matchingMeetings.flatMap((meeting) => meeting.competitor_mentions))].sort()
  const themes = [...new Set(matchingMeetings.map((meeting) => meeting.primary_theme_label))].sort()
  const modules = [...new Set(matchingMeetings.flatMap((meeting) => meeting.product_modules))].sort()

  return (
    <div className="space-y-6">
      <div>
        <Link to={`/accounts${location.search}`} className="text-sm text-sky-300 hover:underline">
          ← Back to Risk radar
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">{account}</h1>
        <p aria-live="polite" className="mt-1 text-sm text-slate-400">
          {matchingMeetings.length} matching calls
          {isFiltered ? ' under the active dashboard filters' : ' in the dataset'}.
        </p>
        {isFiltered && riskRow ? (
          <p className="mt-1 text-xs text-slate-500">
            Risk explanation summarizes this account’s unfiltered history; metrics and call list below reflect the active filters.
          </p>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card title="Highest matching risk">
          <div className="text-2xl font-semibold">{highestRiskMeeting.risk_score.toFixed(2)}</div>
          <div className="mt-2"><ConfidenceBadge signal={highestRiskMeeting.confidence.risk} /></div>
          <p className="mt-2 text-xs text-slate-400">
            {highestRiskMeeting.confidence.risk.evidence.join(' ') || 'No risk evidence recorded.'}
          </p>
        </Card>
        <Card title="Customer sentiment">
          <div className="text-2xl font-semibold">{fmtSent(meanCustomerSentiment)}</div>
          <p className="mt-2 text-xs text-slate-400">
            Mean of calls with customer-side sentiment data ({customerSentiments.length} calls).
          </p>
        </Card>
        <Card title="Risk indicators">
          <div className="flex flex-wrap gap-1">
            {riskFlags.map((flag) => <Badge key={flag} tone="rose">{flag}</Badge>)}
            {competitors.map((competitor) => <Badge key={competitor} tone="amber">{competitor}</Badge>)}
            {!riskFlags.length && !competitors.length ? (
              <span className="text-sm text-slate-400">No matching risk indicators.</span>
            ) : null}
          </div>
          {riskRow?.why_it_matters ? (
            <p className="mt-3 text-xs text-slate-400">{riskRow.why_it_matters}</p>
          ) : null}
        </Card>
      </div>

      <Card title="Account themes and modules">
        <dl className="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <dt className="mb-1 text-xs uppercase text-slate-500">Themes</dt>
            <dd className="flex flex-wrap gap-1">
              {themes.map((theme) => <Badge key={theme}>{theme}</Badge>)}
            </dd>
          </div>
          <div>
            <dt className="mb-1 text-xs uppercase text-slate-500">Product modules</dt>
            <dd className="flex flex-wrap gap-1">
              {modules.map((module) => <Badge key={module}>{module}</Badge>)}
            </dd>
          </div>
        </dl>
      </Card>

      <Card title="Call history">
        <ol className="space-y-3">
          {matchingMeetings.map((meeting) => (
            <li key={meeting.meeting_id} className="rounded-lg border border-slate-800 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{meeting.call_type}</Badge>
                <span className="text-xs text-slate-500">{meeting.start_time?.slice(0, 10) ?? 'Date unavailable'}</span>
                <span className="ml-auto text-xs text-slate-400">
                  risk {meeting.risk_score.toFixed(2)} · sentiment {fmtSent(meeting.customer_sentiment_mean)}
                </span>
              </div>
              <p className="mt-2 font-medium">
                <MeetingLink id={meeting.meeting_id} title={meeting.title} />
              </p>
              <p className="mt-1 text-xs text-slate-400">{meeting.primary_theme_label} · {meeting.product_modules.join(', ') || 'no module tagged'}</p>
              {meeting.summary ? <p className="mt-2 text-sm text-slate-300">{meeting.summary}</p> : null}
            </li>
          ))}
        </ol>
      </Card>
    </div>
  )
}
