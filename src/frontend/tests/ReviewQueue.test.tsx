import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../src/api'
import ReviewQueue from '../src/pages/ReviewQueue'
import type { Meeting, TaxonomyValidation } from '../src/types'

vi.mock('../src/api', () => ({
  api: {
    meetings: vi.fn(),
    taxonomyValidation: vi.fn(),
  },
}))

const confidence: Meeting['confidence'] = {
  call_type: { level: 'high', evidence: ['Support title matched.'] },
  theme: { level: 'high', evidence: ['Theme keyword matched.'] },
  sentiment: { level: 'high', evidence: ['Computed from 8 customer utterances.'] },
  risk: { level: 'high', evidence: ['No risk rule fired.'] },
}

function makeMeeting(
  meeting_id: string,
  overrides: Partial<Meeting> = {},
): Meeting {
  return {
    meeting_id,
    title: `Meeting ${meeting_id}`,
    start_time: '2026-03-10T12:00:00Z',
    duration_min: 5,
    call_type: 'support',
    call_type_method: 'rule',
    call_type_reason: 'Support case title',
    customer_name: 'Northwind',
    customer_domains: [],
    product_modules: ['identity'],
    primary_theme: 'sso_identity_failure',
    primary_theme_label: 'SSO / Identity failures',
    secondary_themes: [],
    theme_rationale: 'SSO matched the title.',
    example_quote: 'SSO failed.',
    provided_topics: [],
    provided_overall_sentiment: 'negative',
    provided_sentiment_score: -0.5,
    utterance_sentiment_mean: -0.5,
    customer_sentiment_mean: -1,
    aegis_sentiment_mean: 0.2,
    sentiment_trajectory: 'flat',
    risk_flags: [],
    risk_score: 0.1,
    confidence,
    competitor_mentions: [],
    action_item_count: 0,
    action_items: [],
    key_moment_types: [],
    key_moments: [],
    summary: 'Customer cannot access SSO.',
    transcript_preview: '',
    utterance_count: 8,
    customer_utterance_count: 8,
    week: '2026-03-09',
    ...overrides,
  }
}

const meetings = [
  makeMeeting('high-risk', { risk_score: 0.7, risk_flags: ['churn'] }),
  makeMeeting('low-confidence', {
    confidence: {
      ...confidence,
      sentiment: { level: 'low', evidence: ['Computed from 1/1 customer utterances.'] },
    },
  }),
  makeMeeting('taxonomy-review', { call_type: 'external' }),
  makeMeeting('normal'),
]

const validation: TaxonomyValidation = {
  status: 'needs_human_review',
  reviewed_meetings: 4,
  reviewed_themes: 1,
  pass_rate: 0.75,
  needs_human_review: 1,
  criteria: [],
  reviews: [
    {
      meeting_id: 'taxonomy-review',
      theme_id: 'sso_identity_failure',
      theme_label: 'SSO / Identity failures',
      status: 'needs_review',
      evidence: { title_match: false, summary_match: false, topic_match: false, quote_match: false },
      why: 'Theme evidence is ambiguous.',
    },
  ],
}

function renderQueue(initialEntry = '/') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <ReviewQueue />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('review queue', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.mocked(api.meetings).mockResolvedValue(meetings)
    vi.mocked(api.taxonomyValidation).mockResolvedValue(validation)
  })

  it('queues high-risk, low-confidence, and taxonomy-flagged meetings with reasons', async () => {
    renderQueue()

    expect(await screen.findByRole('heading', { name: 'Review queue' })).toBeInTheDocument()
    expect(screen.getByText('Meeting high-risk')).toBeInTheDocument()
    expect(screen.getByText('Meeting low-confidence')).toBeInTheDocument()
    expect(screen.getByText('Meeting taxonomy-review')).toBeInTheDocument()
    expect(screen.queryByText('Meeting normal')).not.toBeInTheDocument()
    expect(screen.getByText('High risk score (0.70)')).toBeInTheDocument()
    expect(screen.getByText('Low sentiment confidence')).toBeInTheDocument()
    expect(screen.getByText('Theme evidence needs review')).toBeInTheDocument()
    expect(screen.getByText('Risk signals: churn')).toBeInTheDocument()
  })

  it('marks records reviewed, persists that state, and supports reopening', async () => {
    const firstRender = renderQueue()

    expect(await screen.findByText('Meeting high-risk')).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Mark reviewed' })[0])
    expect(screen.getByRole('button', { name: 'Reviewed (1)' })).toBeInTheDocument()
    expect(window.localStorage.getItem('transcript-intelligence:reviewed-meetings')).toContain('high-risk')
    fireEvent.click(screen.getByRole('button', { name: 'Reviewed (1)' }))
    expect(screen.getByText('Meeting high-risk')).toBeInTheDocument()

    firstRender.unmount()
    renderQueue()
    fireEvent.click(await screen.findByRole('button', { name: 'Reviewed (1)' }))
    expect(screen.getByText('Meeting high-risk')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Reopen review' }))
    expect(screen.getByRole('button', { name: 'Needs review (3)' })).toBeInTheDocument()
  })

  it('applies the shared dashboard filters to the queue', async () => {
    renderQueue('/?callType=support')

    expect(await screen.findByText('Meeting high-risk')).toBeInTheDocument()
    expect(screen.queryByText('Meeting taxonomy-review')).not.toBeInTheDocument()
    expect(screen.getByText(/matching dashboard filters/)).toBeInTheDocument()
  })
})
