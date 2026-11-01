import { useSampleSizeSettings } from './useSampleSizeSettings'

export function SampleSizeNotice({
  sampleSize,
  context,
  compact = false,
}: {
  sampleSize: number
  context: string
  compact?: boolean
}) {
  const { threshold } = useSampleSizeSettings()
  if (sampleSize >= threshold) return null

  const description = `${context} is based on ${sampleSize} ${
    sampleSize === 1 ? 'meeting' : 'meetings'
  }; fewer than ${threshold}. Treat as descriptive, not conclusive.`

  return (
    <span
      role="note"
      aria-label={`Low sample size: ${description}`}
      className={`inline-flex items-center rounded-full border border-amber-800/70 bg-amber-950/40 font-medium text-amber-200 ${
        compact ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1.5 text-xs'
      }`}
    >
      {compact ? `Low n=${sampleSize}` : description}
    </span>
  )
}
