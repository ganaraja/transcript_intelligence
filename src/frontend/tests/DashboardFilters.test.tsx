import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import DashboardFilterBar from '../src/components/DashboardFilterBar'
import Layout from '../src/Layout'
import { MeetingLink } from '../src/lib'
import {
  filterMeetings,
  hasActiveFilters,
  STAKEHOLDER_CALL_TYPES,
  type DashboardFilterState,
} from '../src/dashboardFilters'
import { api } from '../src/api'
import type { Meeting } from '../src/types'

vi.mock('../src/api', () => ({
  api: { meetings: vi.fn() },
}))

const emptyFilters: DashboardFilterState = {
  stakeholder: 'all',
  callType: '',
  module: '',
  account: '',
  from: '',
  to: '',
}

function makeMeeting(overrides: Partial<Meeting> = {}): Meeting {
  return {
    meeting_id: 'm1',
    title: 'Call',
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
    utterance_sentiment_mean: 0,
    customer_sentiment_mean: null,
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
    utterance_count: 0,
    customer_utterance_count: 0,
    week: '2026-03-09',
    ...overrides,
  }
}

function LocationDisplay() {
  const location = useLocation()
  return <output aria-label="Current search">{location.search}</output>
}

function renderFilterBar(initialEntry = '/') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <DashboardFilterBar />
        <LocationDisplay />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('dashboard filters', () => {
  const meetings = [
    makeMeeting(),
    makeMeeting({
      meeting_id: 'm2',
      call_type: 'external',
      customer_name: 'Contoso',
      product_modules: ['billing'],
      start_time: '2026-03-20T12:00:00Z',
    }),
    makeMeeting({
      meeting_id: 'm3',
      call_type: 'internal',
      customer_name: null,
      product_modules: ['identity'],
      start_time: null,
    }),
  ]

  it('applies stakeholder, call type, module, account, and date filters together', () => {
    const result = filterMeetings(meetings, {
      ...emptyFilters,
      stakeholder: 'sales',
      callType: 'external',
      module: 'billing',
      account: 'Contoso',
      from: '2026-03-15',
      to: '2026-03-25',
    })

    expect(result.map((meeting) => meeting.meeting_id)).toEqual(['m2'])
    expect(filterMeetings(meetings, { ...emptyFilters, from: '2026-03-11' })).toEqual([meetings[1]])
    expect(hasActiveFilters({ ...emptyFilters, stakeholder: 'all' })).toBe(false)
    expect(hasActiveFilters({ ...emptyFilters, module: 'identity' })).toBe(true)
  })

  it('defines role presets and intersects them with the selected call type', () => {
    expect(STAKEHOLDER_CALL_TYPES.support).toEqual(['support'])
    expect(STAKEHOLDER_CALL_TYPES.sales).toEqual(['external'])
    expect(STAKEHOLDER_CALL_TYPES.engineering).toEqual(['internal', 'support'])
    expect(
      filterMeetings(meetings, { ...emptyFilters, stakeholder: 'sales', callType: 'support' }),
    ).toEqual([])
  })

  it('updates shareable URL filters and clears them without changing unrelated parameters', async () => {
    vi.mocked(api.meetings).mockResolvedValue(meetings)
    renderFilterBar('/?campaign=demo')

    fireEvent.change(await screen.findByRole('combobox', { name: 'Stakeholder' }), {
      target: { value: 'sales' },
    })
    expect(screen.getByLabelText('Current search')).toHaveTextContent('campaign=demo')
    expect(screen.getByLabelText('Current search')).toHaveTextContent('stakeholder=sales')

    fireEvent.change(screen.getByRole('combobox', { name: 'Call type' }), {
      target: { value: 'external' },
    })
    expect(screen.getByLabelText('Current search')).toHaveTextContent('callType=external')

    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(screen.getByLabelText('Current search')).toHaveTextContent('campaign=demo')
    expect(screen.getByLabelText('Current search')).not.toHaveTextContent('stakeholder')
  })

  it('preserves filters while navigating between dashboard pages and to meeting details', async () => {
    vi.mocked(api.meetings).mockResolvedValue(meetings)
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { unmount } = render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={['/?callType=support']}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="*" element={<LocationDisplay />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    )

    fireEvent.click(await screen.findByRole('link', { name: 'Themes' }))
    expect(screen.getByLabelText('Current search')).toHaveTextContent('callType=support')
    unmount()

    render(
      <MemoryRouter initialEntries={['/themes?callType=support']}>
        <MeetingLink id="m1" title="Open meeting" />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Open meeting' })).toHaveAttribute(
      'href',
      '/meetings/m1?callType=support',
    )
  })
})
