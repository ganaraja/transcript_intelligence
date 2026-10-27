declare module 'react-force-graph-2d' {
  import type { ComponentType, Ref } from 'react'

  export type ForceGraphMethods<N = unknown> = {
    zoomToFit: (ms?: number, padding?: number) => void
  }

  type GraphData = {
    nodes: Array<Record<string, unknown>>
    links: Array<Record<string, unknown>>
  }

  type Props<N> = {
    ref?: Ref<ForceGraphMethods<N> | undefined>
    graphData: GraphData
    backgroundColor?: string
    nodeLabel?: (node: N) => string
    linkColor?: (link: unknown) => string
    nodeCanvasObject?: (node: N, ctx: CanvasRenderingContext2D, globalScale: number) => void
    onNodeClick?: (node: N) => void
  }

  const ForceGraph2D: ComponentType<Props<unknown>>
  export default ForceGraph2D
}
