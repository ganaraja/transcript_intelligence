import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../src/api'
import Accounts from '../src/pages/Accounts'
import AccountDetail from '../src/pages/AccountDetail'
import type { Meeting, RiskRow } from '../src/types'

vi.mock('../src/api', () => ({
  api: {
    risk: vi.fn(),
    meetings: vi.fn(),
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
  risk_flags: ['churn'],
  risk_score: 0.6,
  confidence: {
    call_type: { level: 'high', evidence: [] },
    theme: { level: 'high', evidence: [] },
    sentiment: { level: 'low', evidence: [] },
    risk: { level: 'medium', evidence: ['Churn key moment: churn_signal.'] },
  },
  competitor_mentions: ['Contoso'],
  action_item_count: 0,
  action_items: [],
  key_moment_types: [],
  key_moments: [],
  summary: 'Customer reported an SSO login failure.',
  transcript_preview: '',
  utterance_count: 1,
  customer_utterance_count: 1,
  week: '2026-03-09',
}

const riskRow: RiskRow = {
  account: 'Northwind',
  meetings: 1,
  risk_score: 0.6,
  confidence: meeting.confidence.risk,
  risk_flags: ['churn'],
  mean_customer_sentiment: -1,
  call_types: ['support'],
  themes: ['SSO / Identity failures'],
  competitors: ['Contoso'],
  meeting_ids: ['m1'],
  why_it_matters: 'Customer is considering leaving.',
}

function renderDetail(initialEntry = '/accounts/Northwind') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/accounts/:account" element={<AccountDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

function renderAccountFlow() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/accounts']}>
        <Routes>
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/accounts/:account" element={<AccountDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('account detail', () => {
  beforeEach(() => {
    vi.mocked(api.risk).mockResolvedValue([riskRow])
    vi.mocked(api.meetings).mockResolvedValue([meeting])
  })

  it('shows filtered account metrics, risk evidence, and meeting drill-down links', async () => {
    renderDetail('/accounts/Northwind?callType=support')

    expect(await screen.findByRole('heading', { name: 'Northwind' })).toBeInTheDocument()
    expect(screen.getByText('1 matching calls under the active dashboard filters.')).toBeInTheDocument()
    expect(screen.getByText('0.60')).toBeInTheDocument()
    expect(screen.getByText('Churn key moment: churn_signal.')).toBeInTheDocument()
    expect(screen.getByRole('note', { name: /northwind account metrics is based on 1 meeting; fewer than 5/i })).toBeInTheDocument()
    expect(screen.getByRole('note', { name: /customer sentiment mean is based on 1 meeting; fewer than 5/i })).toBeInTheDocument()
    expect(screen.getByText('Customer reported an SSO login failure.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '← Back to Risk radar' })).toHaveAttribute(
      'href',
      '/accounts?callType=support',
    )
    expect(screen.getByRole('link', { name: meeting.title })).toHaveAttribute(
      'href',
      '/meetings/m1?callType=support',
    )
  })

  it('explains when active filters exclude all meetings for the account', async () => {
    renderDetail('/accounts/Northwind?callType=external')

    expect(
      await screen.findByText(/No account meetings match the current filters/),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '← Back to Risk radar' })).toHaveAttribute(
      'href',
      '/accounts?callType=external',
    )
  })

  it('uses the risk row meeting IDs when account and meeting labels differ', async () => {
    vi.mocked(api.meetings).mockResolvedValue([
      { ...meeting, customer_name: 'Northwind Corporation' },
    ])
    renderDetail()

    expect(await screen.findByText('1 matching calls in the dataset.')).toBeInTheDocument()
    expect(screen.getByText('Customer reported an SSO login failure.')).toBeInTheDocument()
  })

  it('opens account details from Risk radar and shows the linked calls', async () => {
    vi.mocked(api.meetings).mockResolvedValue([
      { ...meeting, customer_name: 'Northwind Corporation' },
    ])
    renderAccountFlow()

    fireEvent.click(await screen.findByRole('link', { name: 'View account details' }))

    expect(await screen.findByRole('heading', { name: 'Northwind' })).toBeInTheDocument()
    expect(screen.getByText('1 matching calls in the dataset.')).toBeInTheDocument()
    expect(screen.getByText('Customer reported an SSO login failure.')).toBeInTheDocument()
  })
})
