import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { api } from '../api'
import { Badge, Card, Err, Loading, fmtSent } from '../lib'

export default function MeetingDetail() {
  const { id = '' } = useParams()
  const q = useQuery({ queryKey: ['meeting', id], queryFn: () => api.meeting(id), enabled: Boolean(id) })
  if (q.isPending) return <Loading />
  if (q.isError) return <Err error={q.error} />
  const m = q.data

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 flex flex-wrap gap-2">
          <Badge>{m.call_type}</Badge>
          {m.product_modules.map((p) => (
            <Badge key={p}>{p}</Badge>
          ))}
        </div>
        <h1 className="text-2xl font-semibold">{m.title}</h1>
        <p className="text-sm text-slate-500">
          {m.start_time} · {m.duration_min} min · {m.customer_name ?? 'internal'} · {m.call_type_reason}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Computed sentiment">
          <dl className="space-y-1 text-sm">
            <div>All speakers {fmtSent(m.utterance_sentiment_mean)}</div>
            <div>Customer {fmtSent(m.customer_sentiment_mean)}</div>
            <div>Aegis {fmtSent(m.aegis_sentiment_mean)}</div>
            <div>Trajectory {m.sentiment_trajectory}</div>
          </dl>
        </Card>
        <Card title="Provided summary labels">
          <dl className="space-y-1 text-sm">
            <div>{m.provided_overall_sentiment ?? '—'}</div>
            <div>Score {m.provided_sentiment_score ?? '—'}</div>
            <div className="text-slate-400">{m.provided_topics.join(', ') || 'no topics'}</div>
          </dl>
        </Card>
        <Card title="Theme">
          <p className="text-sm font-medium">{m.primary_theme_label}</p>
          <p className="mt-1 text-xs text-slate-400">{m.theme_rationale}</p>
        </Card>
      </div>
      <Card title="Why this call">
        <p className="text-sm text-slate-300">{m.summary}</p>
        {m.example_quote ? <blockquote className="mt-3 border-l-2 border-sky-700 pl-3 text-sm italic">{m.example_quote}</blockquote> : null}
      </Card>
      <Card title="Action items">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {m.action_items.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
