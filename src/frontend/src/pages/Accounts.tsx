import { useQuery } from '@tanstack/react-query'
import { api } from '../api'
import { Badge, Card, Err, Loading, MeetingLink, fmtSent } from '../lib'

export default function Accounts() {
  const risk = useQuery({ queryKey: ['risk'], queryFn: api.risk })
  const meetings = useQuery({ queryKey: ['meetings'], queryFn: api.meetings })
  if (risk.isPending) return <Loading />
  if (risk.isError) return <Err error={risk.error} />
  const byId = Object.fromEntries((meetings.data ?? []).map((m) => [m.meeting_id, m]))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Risk radar</h1>
        <p className="mt-1 text-sm text-slate-400">
          Composite of churn key-moments, competitor mentions, urgent titles, and customer-side
          negativity. Sales and support should share one list — not two CRMs.
        </p>
      </div>
      {risk.data.map((row) => (
        <Card key={row.account} title={`${row.account} · score ${row.risk_score.toFixed(2)}`}>
          <p className="mb-2 text-sm text-slate-300">{row.why_it_matters}</p>
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
    </div>
  )
}
