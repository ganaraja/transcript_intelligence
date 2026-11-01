import type { Meeting, TaxonomyValidation } from './types'

export const HIGH_RISK_REVIEW_THRESHOLD = 0.5

export type ReviewQueueItem = {
  meeting: Meeting
  reasons: string[]
}

export function buildReviewQueue(
  meetings: Meeting[],
  reviews: TaxonomyValidation['reviews'],
): ReviewQueueItem[] {
  const taxonomyReviewIds = new Set(
    reviews
      .filter((review) => review.status === 'needs_review')
      .map((review) => review.meeting_id),
  )

  return meetings
    .map((meeting) => {
      const reasons: string[] = []
      if (meeting.risk_score >= HIGH_RISK_REVIEW_THRESHOLD) {
        reasons.push(`High risk score (${meeting.risk_score.toFixed(2)})`)
      }
      for (const [label, signal] of Object.entries(meeting.confidence)) {
        if (signal.level === 'low') reasons.push(`Low ${label} confidence`)
      }
      if (taxonomyReviewIds.has(meeting.meeting_id)) {
        reasons.push('Theme evidence needs review')
      }
      return { meeting, reasons }
    })
    .filter((item) => item.reasons.length > 0)
    .sort(
      (a, b) =>
        Number(b.meeting.risk_score >= HIGH_RISK_REVIEW_THRESHOLD) -
          Number(a.meeting.risk_score >= HIGH_RISK_REVIEW_THRESHOLD) ||
        b.meeting.risk_score - a.meeting.risk_score ||
        b.reasons.length - a.reasons.length ||
        a.meeting.title.localeCompare(b.meeting.title),
    )
}
