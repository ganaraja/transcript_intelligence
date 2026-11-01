import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { CALL_COLORS, Card, Err, Loading } from '../lib'
import { useDashboardFilters } from '../useDashboardFilters'

type GNode = {
  id: string
  label: string
  kind: string
  call_type?: string | null
  risk_score?: number | null
}

type GLink = { kind?: string }

function describeLink(link: GLink): string {
  const kind = link.kind || ''
  if (kind.startsWith('cross_surface')) {
    const lag = kind.match(/_lag_(\d+d)$/)?.[1]
    return `Shared-theme association between calls${lag ? `, ${lag} apart` : ''}; not proof of the same incident or causality.`
  }
  if (kind === 'has_theme') return 'Meeting assigned to this primary theme.'
  if (kind === 'has_module') return 'Meeting tagged with this product module.'
  return 'Association between graph nodes.'
}

export default function GraphPage() {
  const q = useQuery({ queryKey: ['graph'], queryFn: api.graph })
  const meetings = useQuery({ queryKey: ['meetings'], queryFn: api.meetings })
  const navigate = useNavigate()
  const location = useLocation()
  const { apply: applyFilters, isFiltered } = useDashboardFilters()

  const data = useMemo(() => {
    if (!q.data || !meetings.data) return { nodes: [], links: [], meetingCount: 0 }
    const filteredMeetings = applyFilters(meetings.data)
    const allowedMeetingNodes = new Set(filteredMeetings.map((meeting) => `m:${meeting.meeting_id}`))
    const cross = new Set(q.data.cross_surface_themes.map((t) => `t:${t}`))
    const allThemes = new Set(q.data.nodes.filter((node) => node.kind === 'theme').map((node) => node.id))
    const keepThemes = isFiltered ? allThemes : cross.size ? cross : allThemes
    const meetingIds = new Set(
      q.data.edges
        .filter((e) => e.kind === 'has_theme' && keepThemes.has(e.target) && allowedMeetingNodes.has(e.source))
        .map((e) => e.source),
    )
    const connectedNodeIds = new Set(meetingIds)
    for (const edge of q.data.edges) {
      if (meetingIds.has(edge.source) && !edge.kind.startsWith('cross_surface')) {
        connectedNodeIds.add(edge.target)
      }
    }
    const nodes = q.data.nodes.filter((node) =>
      isFiltered
        ? connectedNodeIds.has(node.id)
        : node.kind === 'theme' || node.kind === 'module' || meetingIds.has(node.id),
    )
    const ids = new Set(nodes.map((n) => n.id))
    const links = q.data.edges
      .filter((e) => ids.has(e.source) && ids.has(e.target))
      .map((e) => ({ source: e.source, target: e.target, kind: e.kind }))
    return {
      nodes: nodes.map((n) => ({ ...n })),
      links,
      meetingCount: nodes.filter((node) => node.kind === 'meeting').length,
    }
  }, [q.data, meetings.data, applyFilters, isFiltered])

  if (q.isPending || meetings.isPending) return <Loading />
  if (q.isError) return <Err error={q.error} />
  if (meetings.isError) return <Err error={meetings.error} />

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Cross-surface issue graph</h1>
        <p className="mt-1 text-sm text-slate-400">{q.data.insight}</p>
        <p aria-live="polite" className="mt-2 text-xs text-slate-500">
          Showing graph nodes for {data.meetingCount} meetings
          {isFiltered ? ' matching dashboard filters' : ''}.
        </p>
        <p className="mt-2 max-w-4xl rounded-lg border border-amber-900/60 bg-amber-950/20 px-3 py-2 text-sm text-amber-200/90">
          Shared-theme links show representative calls with the same primary taxonomy label across call
          types. They can surface related conversations, but do not confirm the same incident, a shared
          root cause, or causality.
        </p>
        {isFiltered ? (
          <p className="mt-1 text-xs text-slate-500">
            The insight text summarizes the unfiltered corpus; graph nodes and links match the active filters.
          </p>
        ) : null}
      </div>
      <Card>
        <div aria-label="Graph node and edge legend" className="mb-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
          <span>
            <i className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-400" /> support
          </span>
          <span>
            <i className="mr-1 inline-block h-2 w-2 rounded-full bg-sky-400" /> external
          </span>
          <span>
            <i className="mr-1 inline-block h-2 w-2 rounded-full bg-violet-400" /> internal
          </span>
          <span>
            <i className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-400" /> theme
          </span>
          <span>
            <i className="mr-1 inline-block h-0.5 w-4 align-middle bg-slate-600" /> theme/module assignment
          </span>
          <span>
            <i className="mr-1 inline-block h-0.5 w-4 align-middle bg-rose-400" /> shared-theme call association
          </span>
          <span>Click a meeting node to open the transcript record.</span>
        </div>
        <div className="h-[640px] overflow-hidden rounded-lg bg-slate-950">
          <ForceGraph2D
            graphData={data}
            backgroundColor="#020617"
            nodeLabel={(node) => {
              const n = node as GNode
              if (n.kind === 'meeting') return `${n.call_type || 'Call'} meeting: ${n.label}. Click to open its record.`
              if (n.kind === 'theme') return `Primary theme: ${n.label}. A shared label is not a confirmed incident.`
              if (n.kind === 'module') return `Product module: ${n.label}.`
              return n.label
            }}
            linkLabel={(link) => describeLink(link as GLink)}
            linkColor={(l) =>
              String((l as { kind?: string }).kind || '').startsWith('cross_surface') ? '#fb7185' : '#334155'
            }
            nodeCanvasObject={(node, ctx, globalScale) => {
              const n = node as GNode & { x: number; y: number }
              const color =
                n.kind === 'theme'
                  ? '#34d399'
                  : n.kind === 'module'
                    ? '#94a3b8'
                    : CALL_COLORS[n.call_type || ''] || '#64748b'
              const r = n.kind === 'theme' ? 8 : n.kind === 'module' ? 5 : 4
              ctx.beginPath()
              ctx.arc(n.x, n.y, r, 0, 2 * Math.PI)
              ctx.fillStyle = color
              ctx.fill()
              if (globalScale > 1.4) {
                ctx.font = `${12 / globalScale}px sans-serif`
                ctx.fillStyle = '#cbd5e1'
                ctx.fillText(n.label.slice(0, 42), n.x + 6, n.y + 3)
              }
            }}
            onNodeClick={(node) => {
              const n = node as GNode
              if (n.id.startsWith('m:')) navigate(`/meetings/${n.id.slice(2)}${location.search}`)
            }}
          />
        </div>
        {!data.nodes.length ? (
          <p className="mt-3 text-sm text-slate-400">No graph nodes match the current filters.</p>
        ) : null}
      </Card>
    </div>
  )
}
