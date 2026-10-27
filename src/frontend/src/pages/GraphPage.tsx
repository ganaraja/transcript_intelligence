import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { CALL_COLORS, Card, Err, Loading } from '../lib'

type GNode = {
  id: string
  label: string
  kind: string
  call_type?: string | null
  risk_score?: number | null
}

export default function GraphPage() {
  const q = useQuery({ queryKey: ['graph'], queryFn: api.graph })
  const navigate = useNavigate()

  const data = useMemo(() => {
    if (!q.data) return { nodes: [], links: [] }
    const cross = new Set(q.data.cross_surface_themes.map((t) => `t:${t}`))
    const keepThemes = cross.size ? cross : new Set(q.data.nodes.filter((n) => n.kind === 'theme').map((n) => n.id))
    const meetingIds = new Set(
      q.data.edges.filter((e) => e.kind === 'has_theme' && keepThemes.has(e.target)).map((e) => e.source),
    )
    const nodes = q.data.nodes.filter(
      (n) => n.kind === 'theme' || n.kind === 'module' || meetingIds.has(n.id),
    )
    const ids = new Set(nodes.map((n) => n.id))
    const links = q.data.edges
      .filter((e) => ids.has(e.source) && ids.has(e.target))
      .map((e) => ({ source: e.source, target: e.target, kind: e.kind }))
    return { nodes: nodes.map((n) => ({ ...n })), links }
  }, [q.data])

  if (q.isPending) return <Loading />
  if (q.isError) return <Err error={q.error} />

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Cross-surface issue graph</h1>
        <p className="mt-1 text-sm text-slate-400">{q.data.insight}</p>
      </div>
      <Card>
        <div className="mb-2 flex flex-wrap gap-3 text-xs text-slate-400">
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
          <span>Click a meeting node to open the transcript record.</span>
        </div>
        <div className="h-[640px] overflow-hidden rounded-lg bg-slate-950">
          <ForceGraph2D
            graphData={data}
            backgroundColor="#020617"
            nodeLabel={(n) => (n as GNode).label}
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
              if (n.id.startsWith('m:')) navigate(`/meetings/${n.id.slice(2)}`)
            }}
          />
        </div>
      </Card>
    </div>
  )
}
