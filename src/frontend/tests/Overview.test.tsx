import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../src/api'
import Overview from '../src/pages/Overview'
import type { Meeting, Overview as OverviewData, RunManifest } from '../src/types'

vi.mock('../src/api', () => ({
  api: {
    overview: vi.fn(),
    provenance: vi.fn(),
    voc: vi.fn(),
    risk: vi.fn(),
    meetings: vi.fn(),
  },
}))

const overview: OverviewData = {
  meeting_count: 1,
  call_type_mix: { support: 1, external: 0, internal: 0 },
  module_mix: { identity: 1 },
  mean_utterance_sentiment: -0.5,
  high_risk_accounts: 0,
  approach: { call_type: 'Rules', themes: 'Taxonomy', sentiment: 'Source labels' },
  takeaways: ['Sample takeaway.'],
}

const supportMeeting: Meeting = {
    meeting_id: 'm1',
    title: 'Support call',
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
  }

const meetings: Meeting[] = [
  supportMeeting,
  {
    ...supportMeeting,
    meeting_id: 'm2',
    title: 'Internal engineering sync',
    call_type: 'internal',
    customer_name: null,
    product_modules: ['billing'],
    utterance_sentiment_mean: 0.5,
  },
]

const manifest: RunManifest = {
  generated_at: '2026-10-31T12:00:00+00:00',
  pipeline_version: '0.1.0',
  git_revision: '0123456789abcdef',
  code: {
    sha256: 'code-hash',
    files: [],
    working_tree_clean: false,
  },
  dataset: {
    origin: 'input_dataset; contents not independently verified',
    synthetic_data_generated_by_pipeline: false,
    augmentation: 'none_by_pipeline',
    meeting_count: 1,
    source_file_count: 2,
    source_files: [{ path: 'm1/transcript.json', sha256: 'source-hash' }],
    sha256: 'dataset-hash',
  },
  configuration: {
    llm_refinement_enabled: true,
    llm_api_key_configured: true,
    llm_model: 'gpt-4o-mini',
    llm_prompt_version: 'theme-refinement-v1',
    sentiment_method: 'duration_weighted_source_utterance_labels',
    taxonomy_method: 'rules_keyword_taxonomy',
  },
  theme_refinement: {
    m1: {
      source: 'openai',
      generated_at: '2026-10-31T12:00:00+00:00',
      model: 'gpt-4o-mini',
      prompt_version: 'theme-refinement-v1',
    },
  },
  theme_refinement_counts: { openai: 1 },
  artifacts: ['meetings.json'],
}

function renderOverview(initialEntry = '/') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Overview />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('Overview provenance', () => {
  beforeEach(() => {
    vi.mocked(api.overview).mockResolvedValue(overview)
    vi.mocked(api.provenance).mockResolvedValue(manifest)
    vi.mocked(api.voc).mockResolvedValue([])
    vi.mocked(api.risk).mockResolvedValue([])
    vi.mocked(api.meetings).mockResolvedValue(meetings)
  })

  it('shows run, dataset, and LLM lineage with source hashes', async () => {
    renderOverview()

    expect(await screen.findByText('Data and run provenance')).toBeInTheDocument()
    expect(screen.getByText(/commit 0123456789ab · working tree changed/)).toBeInTheDocument()
    expect(screen.getByText(/1 meetings · 2 source files/)).toBeInTheDocument()
    expect(screen.getByText(/LLM enabled · gpt-4o-mini · prompt theme-refinement-v1/)).toBeInTheDocument()
    expect(screen.getByText(/Refinement applied: 1 meetings \(1 openai\)/)).toBeInTheDocument()
    expect(screen.getByText(/Inputs are not independently verified/)).toBeInTheDocument()

    screen.getByText(/Inspect source file hashes/).click()
    expect(await screen.findByText(/m1\/transcript.json · source-hash/)).toBeInTheDocument()
  })

  it('surfaces a missing provenance manifest instead of hiding the error', async () => {
    vi.mocked(api.provenance).mockRejectedValue(new Error('/api/provenance failed (404)'))

    renderOverview()

    expect(await screen.findByText(/\/api\/provenance failed \(404\)/)).toBeInTheDocument()
  })

  it('recomputes the Overview metrics for URL filters', async () => {
    renderOverview('/?callType=support')

    expect(await screen.findByText('Showing 1 of 2 meetings matching dashboard filters.')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('1 / 0 / 0')).toBeInTheDocument()
    expect(screen.getByText('-0.50')).toBeInTheDocument()
  })
})
