import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../src/api'
import Accounts from '../src/pages/Accounts'
import type { Meeting, RiskRow } from '../src/types'

vi.mock('../src/api', () => ({
  api: {
    risk: vi.fn(),
    meetings: vi.fn(),
  },
}))

const riskRows: RiskRow[] = [
  {
    account: 'Northwind',
    meetings: 1,
    risk_score: 0.6,
    confidence: { level: 'medium', evidence: ['Churn key moment: churn_signal.'] },
    risk_flags: ['churn'],
    mean_customer_sentiment: -0.5,
    call_types: ['support'],
    themes: ['SSO / Identity failures'],
    competitors: [],
    meeting_ids: ['m1'],
    why_it_matters: 'Customer is considering leaving.',
  },
]

const meetings: Meeting[] = [
  {
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
    risk_flags: ['churn'],
    risk_score: 0.6,
    confidence: {
      call_type: { level: 'high', evidence: [] },
      theme: { level: 'high', evidence: [] },
      sentiment: { level: 'low', evidence: [] },
      risk: { level: 'medium', evidence: ['Churn key moment: churn_signal.'] },
    },
    competitor_mentions: [],
    action_item_count: 0,
    action_items: [],
    key_moment_types: [],
    key_moments: [],
    summary: '',
    transcript_preview: '',
    utterance_count: 1,
    customer_utterance_count: 1,
    week: '2026-03-09',
  },
]

function renderAccounts(initialEntry = '/') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Accounts />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('Accounts risk confidence', () => {
  beforeEach(() => {
    vi.mocked(api.risk).mockResolvedValue(riskRows)
    vi.mocked(api.meetings).mockResolvedValue(meetings)
  })

  it('shows risk confidence and the supporting rule evidence', async () => {
    renderAccounts()

    expect(await screen.findByText('Risk-rule confidence:')).toBeInTheDocument()
    expect(screen.getByText('medium confidence')).toBeInTheDocument()
    expect(screen.getByText('Churn key moment: churn_signal.')).toBeInTheDocument()
  })

  it('removes risk rows when no associated meeting matches the selected filter', async () => {
    renderAccounts('/?callType=external')

    expect(await screen.findByText('Showing 0 accounts from 0 matching meetings matching dashboard filters.')).toBeInTheDocument()
    expect(screen.getByText('No risk accounts match the current filters.')).toBeInTheDocument()
  })
})
