import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../src/api'
import MeetingDetail from '../src/pages/MeetingDetail'
import type { Meeting } from '../src/types'

vi.mock('../src/api', () => ({
  api: {
    meeting: vi.fn(),
  },
}))

const meeting: Meeting = {
  meeting_id: 'm1',
  title: 'Support Case - SSO login failure',
  start_time: '2026-03-10T12:00:00Z',
  duration_min: 5,
  call_type: 'support',
  call_type_method: 'rule',
  call_type_reason: 'Support case title',
  customer_name: 'Northwind',
  customer_domains: ['northwind.com'],
  product_modules: ['identity'],
  primary_theme: 'sso_identity_failure',
  primary_theme_label: 'SSO / Identity failures',
  secondary_themes: [],
  theme_rationale: 'SSO matched the title.',
  example_quote: 'SSO login failed after the identity update.',
  provided_topics: [],
  provided_overall_sentiment: 'negative',
  provided_sentiment_score: -0.5,
  utterance_sentiment_mean: -0.5,
  customer_sentiment_mean: -1,
  aegis_sentiment_mean: 0.2,
  sentiment_trajectory: 'flat',
  risk_flags: ['negative_customer'],
  risk_score: 0.2,
  confidence: {
    call_type: { level: 'high', evidence: ['Support case title matched.'] },
    theme: { level: 'medium', evidence: ['Title matched SSO.'] },
    sentiment: { level: 'low', evidence: ['Computed from 1/1 customer utterances.'] },
    risk: { level: 'medium', evidence: ['Rule triggered: negative customer.'] },
  },
  competitor_mentions: [],
  action_item_count: 0,
  action_items: [],
  key_moment_types: [],
  key_moments: [],
  summary: 'Customer cannot access SSO.',
  transcript_preview: '',
  utterance_count: 1,
  customer_utterance_count: 1,
  week: '2026-03-09',
}

function renderMeetingDetail() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/meetings/m1']}>
        <Routes>
          <Route path="/meetings/:id" element={<MeetingDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('MeetingDetail confidence signals', () => {
  beforeEach(() => {
    vi.mocked(api.meeting).mockResolvedValue(meeting)
  })

  it('shows confidence levels and evidence for each computed output', async () => {
    renderMeetingDetail()

    expect(await screen.findByText('Confidence and supporting evidence')).toBeInTheDocument()
    expect(screen.getByText('Call type')).toBeInTheDocument()
    expect(screen.getAllByText('Theme').length).toBeGreaterThan(0)
    expect(screen.getByText('Sentiment')).toBeInTheDocument()
    expect(screen.getByText('Risk')).toBeInTheDocument()
    expect(screen.getByText('Computed from 1/1 customer utterances.')).toBeInTheDocument()
    expect(screen.getByText(/low confidence · review/)).toBeInTheDocument()
    expect(screen.getByText(/not calibrated probabilities/)).toBeInTheDocument()
  })
})
