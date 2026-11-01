import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
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
    Bar: passthrough,
    BarChart: passthrough,
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
  makeMeeting({
    meeting_id: 'm3',
    title: 'External identity review',
    call_type: 'external',
    customer_name: 'Northwind',
    sentiment_trajectory: 'recovering',
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
    const table = screen.getByRole('table', { name: 'Trajectory distribution by call type' })
    const supportRow = within(table).getByRole('row', { name: /support/i })
    expect(within(supportRow).getAllByRole('cell').map((cell) => cell.textContent)).toEqual([
      '0 (0.0%)',
      '1 (100.0%)',
      '0 (0.0%)',
      '1',
    ])
    expect(screen.getByText('Narrative takeaways below summarize the unfiltered corpus.')).toBeInTheDocument()
  })

  it('shows trajectory counts and within-call-type percentages for all types', async () => {
    renderPage(<Sentiment />, '/sentiment')

    expect(await screen.findByRole('group', { name: 'Sentiment trajectory composition by call type' })).toBeInTheDocument()
    expect(screen.getByLabelText('Trajectory chart legend')).toBeInTheDocument()
    const table = await screen.findByRole('table', { name: 'Trajectory distribution by call type' })
    const supportRow = within(table).getByRole('row', { name: /support/i })
    const externalRow = within(table).getByRole('row', { name: /external/i })
    const internalRow = within(table).getByRole('row', { name: /internal/i })
    expect(within(supportRow).getAllByRole('cell').map((cell) => cell.textContent)).toEqual([
      '0 (0.0%)',
      '1 (100.0%)',
      '0 (0.0%)',
      '1',
    ])
    expect(within(externalRow).getAllByRole('cell').map((cell) => cell.textContent)).toEqual([
      '1 (100.0%)',
      '0 (0.0%)',
      '0 (0.0%)',
      '1',
    ])
    expect(within(internalRow).getAllByRole('cell').map((cell) => cell.textContent)).toEqual([
      '0 (0.0%)',
      '0 (0.0%)',
      '1 (100.0%)',
      '1',
    ])
    expect(
      within(within(table).getByRole('row', { name: /all types/i }))
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    ).toEqual(['1 (33.3%)', '1 (33.3%)', '1 (33.3%)', '3'])
  })

  it('renders trajectory segments as one continuous, proportioned bar', async () => {
    vi.mocked(api.meetings).mockResolvedValue([
      makeMeeting({ meeting_id: 'recovering', call_type: 'external', sentiment_trajectory: 'recovering' }),
      makeMeeting({ meeting_id: 'flat', call_type: 'external', sentiment_trajectory: 'flat' }),
      makeMeeting({ meeting_id: 'deteriorating', call_type: 'external', sentiment_trajectory: 'deteriorating' }),
    ])
    renderPage(<Sentiment />, '/sentiment')

    const bar = await screen.findByRole('img', {
      name: /external: 1 recovering \(33\.3%\), 1 flat \(33\.3%\), 1 deteriorating \(33\.3%\)/,
    })
    const segments = Array.from(bar.children) as HTMLElement[]

    expect(segments).toHaveLength(3)
    expect(segments.map((segment) => segment.style.flexGrow)).toEqual(['1', '1', '1'])
    expect(segments.map((segment) => segment.style.backgroundColor)).toEqual([
      'rgb(52, 211, 153)',
      'rgb(250, 204, 21)',
      'rgb(220, 38, 38)',
    ])
    expect(bar.className).not.toContain('gap-')
    expect(segments[0].className).toContain('rounded-l-full')
    expect(segments[1].className).toContain('border-l')
    expect(segments[2].className).toContain('rounded-r-full')
  })

  it('compares provided sentiment polarity with utterance sentiment and lists conflicts', async () => {
    vi.mocked(api.meetings).mockResolvedValue([
      makeMeeting({
        meeting_id: 'negative-agreement',
        provided_overall_sentiment: 'mixed-negative',
        utterance_sentiment_mean: -0.5,
      }),
      makeMeeting({
        meeting_id: 'positive-conflict',
        call_type: 'external',
        title: 'Positive label, negative utterances',
        provided_overall_sentiment: 'very-positive',
        utterance_sentiment_mean: -0.4,
      }),
      makeMeeting({
        meeting_id: 'neutral-agreement',
        call_type: 'internal',
        provided_overall_sentiment: 'neutral',
        utterance_sentiment_mean: 0.15,
      }),
      makeMeeting({
        meeting_id: 'positive-agreement',
        provided_overall_sentiment: 'mixed-positive',
        utterance_sentiment_mean: 0.16,
      }),
      makeMeeting({
        meeting_id: 'no-utterances',
        call_type: 'internal',
        provided_overall_sentiment: 'negative',
        utterance_count: 0,
      }),
      makeMeeting({ meeting_id: 'no-provided-label' }),
    ])
    renderPage(<Sentiment />, '/sentiment')

    expect(await screen.findByText('4 compared')).toBeInTheDocument()
    expect(screen.getByText('3 aligned')).toBeInTheDocument()
    expect(screen.getByText('1 conflicts')).toBeInTheDocument()
    expect(screen.getByText('2 not compared')).toBeInTheDocument()

    const table = screen.getByRole('table', { name: 'Sentiment agreement by call type' })
    expect(within(within(table).getByRole('row', { name: /support/i }))
      .getAllByRole('cell').map((cell) => cell.textContent)).toEqual(['2', '2', '0', '100.0%'])
    expect(within(within(table).getByRole('row', { name: /external/i }))
      .getAllByRole('cell').map((cell) => cell.textContent)).toEqual(['1', '0', '1', '0.0%'])
    expect(within(within(table).getByRole('row', { name: /internal/i }))
      .getAllByRole('cell').map((cell) => cell.textContent)).toEqual(['1', '1', '0', '100.0%'])

    const conflicts = screen.getByRole('table', { name: 'Sentiment polarity conflicts' })
    expect(within(conflicts).getByRole('link', { name: 'Positive label, negative utterances' })).toHaveAttribute(
      'href',
      '/meetings/positive-conflict',
    )
    expect(within(conflicts).getByText('very-positive')).toBeInTheDocument()
    expect(within(conflicts).getByRole('cell', { name: /negative.*-0\.40/ })).toBeInTheDocument()
    expect(within(conflicts).queryByText('no-utterances')).not.toBeInTheDocument()
    expect(within(conflicts).queryByText('no-provided-label')).not.toBeInTheDocument()
  })

  it('recomputes sentiment agreement and conflicts with active dashboard filters', async () => {
    vi.mocked(api.meetings).mockResolvedValue([
      makeMeeting({
        meeting_id: 'support-agreement',
        provided_overall_sentiment: 'negative',
        utterance_sentiment_mean: -0.5,
      }),
      makeMeeting({
        meeting_id: 'external-conflict',
        call_type: 'external',
        title: 'External sentiment conflict',
        provided_overall_sentiment: 'positive',
        utterance_sentiment_mean: -0.5,
      }),
    ])
    renderPage(<Sentiment />, '/sentiment?callType=external')

    expect(await screen.findByText('1 compared')).toBeInTheDocument()
    expect(screen.getByText('0 aligned')).toBeInTheDocument()
    expect(screen.getByText('1 conflicts')).toBeInTheDocument()
    const conflicts = screen.getByRole('table', { name: 'Sentiment polarity conflicts' })
    expect(within(conflicts).getByRole('link', { name: 'External sentiment conflict' })).toHaveAttribute(
      'href',
      '/meetings/external-conflict?callType=external',
    )
    expect(within(conflicts).queryByRole('link', { name: 'Support identity call' })).not.toBeInTheDocument()
  })

  it('limits issue graph nodes to matching meetings and labels corpus-wide insight text', async () => {
    renderPage(<GraphPage />, '/graph?callType=support')

    expect(await screen.findByLabelText('Graph nodes')).toHaveTextContent('m:m1')
    expect(screen.getByLabelText('Graph nodes')).not.toHaveTextContent('m:m2')
    expect(screen.getByText('The insight text summarizes the unfiltered corpus; the graph is a filtered association view, not evidence of causality.')).toBeInTheDocument()
  })

  it('shows all theme and module variants in the unfiltered graph by default', async () => {
    renderPage(<GraphPage />, '/graph')

    const nodes = await screen.findByLabelText('Graph nodes')
    expect(nodes).toHaveTextContent('t:identity')
    expect(nodes).toHaveTextContent('t:billing')
    expect(nodes).toHaveTextContent('x:identity')
    expect(nodes).toHaveTextContent('x:billing')
    expect(nodes).toHaveTextContent('m:m1')
    expect(nodes).not.toHaveTextContent('m:m2')
  })
})
