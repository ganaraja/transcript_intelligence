import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../src/api'
import Themes from '../src/pages/Themes'
import type { Meeting, ThemeBucket } from '../src/types'

vi.mock('../src/api', () => ({
  api: {
    themes: vi.fn(),
    meetings: vi.fn(),
  },
}))

const themeBuckets: ThemeBucket[] = [
  {
    theme_id: 'sso_identity_failure',
    label: 'SSO / Identity failures',
    count: 1,
    by_call_type: { support: 1 },
    example_meeting_ids: ['meeting-sso'],
    rationale: 'SSO was the strongest title match.',
  },
  {
    theme_id: 'renewal_commercial',
    label: 'Renewal & commercial',
    count: 1,
    by_call_type: { external: 1 },
    example_meeting_ids: ['meeting-renewal'],
    rationale: 'Renewal was the strongest title match.',
  },
]

const meetings: Meeting[] = [
  {
    meeting_id: 'meeting-sso',
    title: 'Support Case #42 - Login failure',
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
    theme_rationale: 'SSO was the strongest title match.',
    example_quote: 'We cannot sign in through SSO after the identity update.',
    provided_topics: [],
    provided_overall_sentiment: 'negative',
    provided_sentiment_score: -0.5,
    utterance_sentiment_mean: -0.5,
    customer_sentiment_mean: -1,
    aegis_sentiment_mean: 0.2,
    sentiment_trajectory: 'flat',
    risk_flags: [],
    risk_score: 0,
    competitor_mentions: [],
    action_item_count: 0,
    action_items: [],
    key_moment_types: [],
    key_moments: [],
    summary: '',
    transcript_preview: '',
    utterance_count: 2,
    customer_utterance_count: 1,
    week: '2026-03-09',
  },
  {
    meeting_id: 'meeting-renewal',
    title: 'Aegis / Northwind - Renewal review',
    start_time: '2026-03-11T12:00:00Z',
    duration_min: 10,
    call_type: 'external',
    call_type_method: 'rule',
    call_type_reason: 'Aegis / account title',
    customer_name: 'Northwind',
    customer_domains: ['northwind.com'],
    product_modules: ['billing'],
    primary_theme: 'renewal_commercial',
    primary_theme_label: 'Renewal & commercial',
    secondary_themes: [],
    theme_rationale: 'Renewal was the strongest title match.',
    example_quote: 'We are discussing the upcoming annual renewal.',
    provided_topics: [],
    provided_overall_sentiment: 'neutral',
    provided_sentiment_score: 0,
    utterance_sentiment_mean: 0,
    customer_sentiment_mean: 0,
    aegis_sentiment_mean: 0,
    sentiment_trajectory: 'flat',
    risk_flags: [],
    risk_score: 0,
    competitor_mentions: [],
    action_item_count: 0,
    action_items: [],
    key_moment_types: [],
    key_moments: [],
    summary: '',
    transcript_preview: '',
    utterance_count: 2,
    customer_utterance_count: 1,
    week: '2026-03-09',
  },
]

function renderThemes() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Themes />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('Themes page', () => {
  beforeEach(() => {
    vi.mocked(api.themes).mockResolvedValue(themeBuckets)
    vi.mocked(api.meetings).mockResolvedValue(meetings)
  })

  it('shows examples for the selected theme', async () => {
    renderThemes()

    const initialExamples = await screen.findByRole('heading', {
      name: 'SSO / Identity failures — examples',
    })
    expect(initialExamples).toBeInTheDocument()
    expect(screen.getByText('Support Case #42 - Login failure')).toBeInTheDocument()
    expect(screen.getByText(/cannot sign in through SSO/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Renewal & commercial/ }))

    expect(
      await screen.findByRole('heading', { name: 'Renewal & commercial — examples' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Aegis / Northwind - Renewal review')).toBeInTheDocument()
    expect(screen.getByText(/upcoming annual renewal/)).toBeInTheDocument()
  })

  it('shows an actionable error when themes cannot be loaded', async () => {
    vi.mocked(api.themes).mockRejectedValue(new Error('/api/themes failed (500)'))

    renderThemes()

    expect(await screen.findByText(/\/api\/themes failed \(500\)/)).toBeInTheDocument()
  })
})
