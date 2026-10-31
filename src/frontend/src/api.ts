import type {
  GraphPayload,
  HeatCell,
  Meeting,
  Overview,
  RiskRow,
  RunManifest,
  SentimentPoint,
  TaxonomyValidation,
  ThemeBucket,
  VocRow,
} from './types'

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) {
    throw new Error(`${path} failed (${res.status})`)
  }
  return res.json() as Promise<T>
}

export const api = {
  overview: () => getJson<Overview>('/api/overview'),
  provenance: () => getJson<RunManifest>('/api/provenance'),
  meetings: () => getJson<Meeting[]>('/api/meetings'),
  meeting: (id: string) => getJson<Meeting>(`/api/meetings/${id}`),
  themes: () => getJson<ThemeBucket[]>('/api/themes'),
  taxonomyValidation: () => getJson<TaxonomyValidation>('/api/taxonomy-validation'),
  sentiment: () =>
    getJson<{ trends: SentimentPoint[]; heatmap: HeatCell[]; takeaways: string[] }>(
      '/api/sentiment',
    ),
  risk: () => getJson<RiskRow[]>('/api/risk'),
  graph: () => getJson<GraphPayload>('/api/graph'),
  voc: () => getJson<VocRow[]>('/api/voc'),
}
