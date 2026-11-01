import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api'
import { useDashboardFilters } from '../useDashboardFilters'
import { Badge, Card, Err, Loading, MeetingLink } from '../lib'
import { buildReviewQueue, HIGH_RISK_REVIEW_THRESHOLD } from '../reviewQueue'

const STORAGE_KEY = 'transcript-intelligence:reviewed-meetings'

type QueueView = 'needs-review' | 'reviewed'

function readReviewedIds(): string[] {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  try {
    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) && parsed.every((id) => typeof id === 'string') ? parsed : []
  } catch (error) {
    console.error('Could not read saved review statuses.', error)
    return []
  }
}

export default function ReviewQueue() {
  const meetings = useQuery({ queryKey: ['meetings'], queryFn: api.meetings })
  const validation = useQuery({
    queryKey: ['taxonomy-validation'],
    queryFn: api.taxonomyValidation,
  })
  const { apply: applyFilters, isFiltered } = useDashboardFilters()
  const [reviewedIds, setReviewedIds] = useState(() => new Set(readReviewedIds()))
  const [view, setView] = useState<QueueView>('needs-review')

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...reviewedIds]))
  }, [reviewedIds])

  const queue = useMemo(
    () => buildReviewQueue(meetings.data ?? [], validation.data?.reviews ?? []),
    [meetings.data, validation.data],
  )

  if (meetings.isPending || validation.isPending) return <Loading />
  if (meetings.isError) return <Err error={meetings.error} />
  if (validation.isError) return <Err error={validation.error} />

  const filteredMeetingIds = new Set(
    applyFilters(queue.map((item) => item.meeting)).map((meeting) => meeting.meeting_id),
  )
  const filteredQueue = queue.filter((item) => filteredMeetingIds.has(item.meeting.meeting_id))
  const needsReview = filteredQueue.filter((item) => !reviewedIds.has(item.meeting.meeting_id))
  const reviewed = filteredQueue.filter((item) => reviewedIds.has(item.meeting.meeting_id))
  const visibleItems = view === 'needs-review' ? needsReview : reviewed

  const toggleReviewed = (meetingId: string) => {
    setReviewedIds((current) => {
      const next = new Set(current)
      if (next.has(meetingId)) next.delete(meetingId)
      else next.add(meetingId)
      return next
    })
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Review queue</h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-400">
          Prioritize records with a risk score of at least {HIGH_RISK_REVIEW_THRESHOLD.toFixed(2)},
          low operational confidence, or weak theme evidence. These are review cues, not calibrated
          risk predictions.
        </p>
        <p aria-live="polite" className="mt-2 text-xs text-slate-500">
          Showing {filteredQueue.length} of {queue.length} flagged meetings
          {isFiltered ? ' matching dashboard filters' : ''}. Review status is saved in this browser.
        </p>
      </header>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Review status">
        <button
          type="button"
          aria-pressed={view === 'needs-review'}
          className={`rounded-md border px-3 py-1.5 text-sm ${
            view === 'needs-review'
              ? 'border-amber-700 bg-amber-950/50 text-amber-200'
              : 'border-slate-700 text-slate-400 hover:bg-slate-800'
          }`}
          onClick={() => setView('needs-review')}
        >
          Needs review ({needsReview.length})
        </button>
        <button
          type="button"
          aria-pressed={view === 'reviewed'}
          className={`rounded-md border px-3 py-1.5 text-sm ${
            view === 'reviewed'
              ? 'border-emerald-700 bg-emerald-950/50 text-emerald-200'
              : 'border-slate-700 text-slate-400 hover:bg-slate-800'
          }`}
          onClick={() => setView('reviewed')}
        >
          Reviewed ({reviewed.length})
        </button>
      </div>

      {visibleItems.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-400">
            {view === 'needs-review'
              ? 'No flagged meetings need review for the current filters.'
              : 'No meetings have been marked reviewed for the current filters.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {visibleItems.map(({ meeting, reasons }) => (
            <Card key={meeting.meeting_id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Badge>{meeting.call_type}</Badge>
                    <Badge tone={meeting.risk_score >= HIGH_RISK_REVIEW_THRESHOLD ? 'rose' : 'amber'}>
                      Risk {meeting.risk_score.toFixed(2)}
                    </Badge>
                    {meeting.customer_name ? <Badge tone="slate">{meeting.customer_name}</Badge> : null}
                  </div>
                  <h2 className="text-base font-semibold">
                    <MeetingLink id={meeting.meeting_id} title={meeting.title} />
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {meeting.start_time ?? 'Date unavailable'} · {meeting.primary_theme_label}
                    {meeting.product_modules.length ? ` · ${meeting.product_modules.join(', ')}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  className={`rounded-md border px-3 py-1.5 text-xs ${
                    view === 'needs-review'
                      ? 'border-emerald-800 text-emerald-300 hover:bg-emerald-950/50'
                      : 'border-amber-800 text-amber-300 hover:bg-amber-950/50'
                  }`}
                  onClick={() => toggleReviewed(meeting.meeting_id)}
                >
                  {view === 'needs-review' ? 'Mark reviewed' : 'Reopen review'}
                </button>
              </div>
              <div className="mt-3 border-t border-slate-800 pt-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Review cues</h3>
                <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-300">
                  {reasons.map((reason) => <li key={reason}>{reason}</li>)}
                </ul>
                {meeting.risk_flags.length ? (
                  <p className="mt-2 text-xs text-slate-500">
                    Risk signals: {meeting.risk_flags.join(', ')}
                  </p>
                ) : null}
                {Object.entries(meeting.confidence)
                  .filter(([, signal]) => signal.level === 'low' && signal.evidence.length > 0)
                  .map(([label, signal]) => (
                    <p key={label} className="mt-1 text-xs text-slate-500">
                      {label[0].toUpperCase() + label.slice(1)} evidence: {signal.evidence.join(' ')}
                    </p>
                  ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
