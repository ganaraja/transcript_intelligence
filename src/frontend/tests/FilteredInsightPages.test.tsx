import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../src/api'
import GraphPage from '../src/pages/GraphPage'
import Sentiment from '../src/pages/Sentiment'
import type { GraphPayload, Meeting } from '../src/types'

vi.mock('../src/api', () => ({
  api: {
    graph: vi.fn(),
    meetings: vi.fn(),
    sentiment: vi.fn(),
  },
}))

vi.mock('recharts', async () => {
  const React = await import('react')
  const passthrough = ({ children }: { children?: React.ReactNode }) =>
    React.createElement('div', null, children)
  return {
    CartesianGrid: passthrough,
    Legend: passthrough,
    Line: passthrough,
    LineChart: passthrough,
    ResponsiveContainer: passthrough,
    Tooltip: passthrough,
    XAxis: passthrough,
    YAxis: passthrough,
  }
})

vi.mock('react-force-graph-2d', async () => {
  const React = await import('react')
  return {
    default: ({ graphData }: { graphData: { nodes: Array<{ id: string }> } }) =>
      React.createElement('output', { 'aria-label': 'Graph nodes' }, graphData.nodes.map((node) => node.id).join(',')),
  }
})

function makeMeeting(overrides: Partial<Meeting> = {}): Meeting {
  return {
    meeting_id: 'm1',
    title: 'Support identity call',
    start_time: '2026-03-10T12:00:00Z',
    duration_min: 5,
    call_type: 'support',
    call_type_method: 'rule',
    call_type_reason: 'title',
    customer_name: 'Northwind',
    customer_domains: [],
    product_modules: ['identity'],
    primary_theme: 'identity',
    primary_theme_label: 'Identity',
    secondary_themes: [],
    theme_rationale: '',
    example_quote: '',
    provided_topics: [],
    provided_overall_sentiment: null,
    provided_sentiment_score: null,
    utterance_sentiment_mean: -0.5,
    customer_sentiment_mean: -0.5,
    aegis_sentiment_mean: null,
    sentiment_trajectory: 'flat',
    risk_flags: [],
    risk_score: 0,
    confidence: {
      call_type: { level: 'high', evidence: [] },
      theme: { level: 'high', evidence: [] },
      sentiment: { level: 'high', evidence: [] },
      risk: { level: 'high', evidence: [] },
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
    ...overrides,
  }
}

const meetings = [
  makeMeeting(),
  makeMeeting({
    meeting_id: 'm2',
    title: 'Internal billing sync',
    call_type: 'internal',
    customer_name: null,
    product_modules: ['billing'],
    primary_theme: 'billing',
    primary_theme_label: 'Billing',
    utterance_sentiment_mean: 0.5,
    sentiment_trajectory: 'deteriorating',
  }),
]

const graph: GraphPayload = {
  nodes: [
    { id: 'm:m1', label: 'Support identity call', kind: 'meeting', call_type: 'support', risk_score: 0 },
    { id: 'm:m2', label: 'Internal billing sync', kind: 'meeting', call_type: 'internal', risk_score: 0 },
    { id: 't:identity', label: 'Identity', kind: 'theme' },
    { id: 't:billing', label: 'Billing', kind: 'theme' },
    { id: 'x:identity', label: 'identity', kind: 'module' },
    { id: 'x:billing', label: 'billing', kind: 'module' },
  ],
  edges: [
    { source: 'm:m1', target: 't:identity', kind: 'has_theme' },
    { source: 'm:m1', target: 'x:identity', kind: 'has_module' },
    { source: 'm:m2', target: 't:billing', kind: 'has_theme' },
    { source: 'm:m2', target: 'x:billing', kind: 'has_module' },
  ],
  cross_surface_themes: ['identity'],
  insight: 'Corpus-wide graph insight.',
}

function renderPage(page: React.ReactNode, initialEntry: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[initialEntry]}>{page}</MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('filtered insight pages', () => {
  beforeEach(() => {
    vi.mocked(api.meetings).mockResolvedValue(meetings)
    vi.mocked(api.graph).mockResolvedValue(graph)
    vi.mocked(api.sentiment).mockResolvedValue({ trends: [], heatmap: [], takeaways: ['Whole-corpus takeaway.'] })
  })

  it('recomputes sentiment summaries using matching meetings', async () => {
    renderPage(<Sentiment />, '/sentiment?callType=support')

    expect(await screen.findByText('Showing 1 meetings matching dashboard filters.')).toBeInTheDocument()
    expect(screen.getByText('Recovering 0 · Flat 1 · Deteriorating 0')).toBeInTheDocument()
    expect(screen.getByText('Narrative takeaways below summarize the unfiltered corpus.')).toBeInTheDocument()
  })

  it('limits issue graph nodes to matching meetings and labels corpus-wide insight text', async () => {
    renderPage(<GraphPage />, '/graph?callType=support')

    expect(await screen.findByLabelText('Graph nodes')).toHaveTextContent('m:m1')
    expect(screen.getByLabelText('Graph nodes')).not.toHaveTextContent('m:m2')
    expect(screen.getByText('The insight text summarizes the unfiltered corpus; the graph is a filtered association view, not evidence of causality.')).toBeInTheDocument()
  })
})
