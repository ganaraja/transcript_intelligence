export type CallType = 'support' | 'external' | 'internal'

export type Meeting = {
  meeting_id: string
  title: string
  start_time: string | null
  duration_min: number
  call_type: CallType
  call_type_method: string
  call_type_reason: string
  customer_name: string | null
  customer_domains: string[]
  product_modules: string[]
  primary_theme: string
  primary_theme_label: string
  secondary_themes: string[]
  theme_rationale: string
  example_quote: string
  provided_topics: string[]
  provided_overall_sentiment: string | null
  provided_sentiment_score: number | null
  utterance_sentiment_mean: number
  customer_sentiment_mean: number | null
  aegis_sentiment_mean: number | null
  sentiment_trajectory: string
  risk_flags: string[]
  risk_score: number
  competitor_mentions: string[]
  action_item_count: number
  action_items: string[]
  key_moment_types: string[]
  key_moments: Array<Record<string, unknown>>
  summary: string
  transcript_preview: string
  utterance_count: number
  customer_utterance_count: number
  week: string | null
}

export type Overview = {
  meeting_count: number
  call_type_mix: Record<string, number>
  module_mix: Record<string, number>
  mean_utterance_sentiment: number
  high_risk_accounts: number
  approach: Record<string, string>
  takeaways: string[]
}

export type ThemeBucket = {
  theme_id: string
  label: string
  count: number
  by_call_type: Record<string, number>
  example_meeting_ids: string[]
  rationale: string
}

export type SentimentPoint = {
  week: string
  call_type: string
  mean_customer: number | null
  mean_all: number
  n: number
}

export type HeatCell = {
  module: string
  call_type: string
  mean: number
  n: number
}

export type RiskRow = {
  account: string
  meetings: number
  risk_score: number
  risk_flags: string[]
  mean_customer_sentiment: number | null
  call_types: string[]
  themes: string[]
  competitors: string[]
  meeting_ids: string[]
  why_it_matters: string
}

export type GraphPayload = {
  nodes: Array<{
    id: string
    label: string
    kind: 'meeting' | 'theme' | 'module'
    call_type?: string | null
    risk_score?: number | null
  }>
  edges: Array<{ source: string; target: string; kind: string }>
  cross_surface_themes: string[]
  insight: string
}

export type VocRow = {
  voc_type: string
  module: string | null
  count: number
  why_it_matters: string
  examples: Array<{
    meeting_id: string
    title: string
    quote: string
    customer_name: string | null
  }>
}
