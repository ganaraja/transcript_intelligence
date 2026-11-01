import { useEffect, useState, type ReactNode } from 'react'
import { DEFAULT_SAMPLE_SIZE_THRESHOLD, SAMPLE_SIZE_THRESHOLDS } from './sampleSizeConfig'
import { SampleSizeSettingsContext } from './sampleSizeSettingsContext'

const STORAGE_KEY = 'transcript-intelligence:sample-size-threshold'

function isSampleSizeThreshold(value: number): value is (typeof SAMPLE_SIZE_THRESHOLDS)[number] {
  return SAMPLE_SIZE_THRESHOLDS.some((threshold) => threshold === value)
}

function readStoredThreshold(): number {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  const parsed = Number(stored)
  return isSampleSizeThreshold(parsed) ? parsed : DEFAULT_SAMPLE_SIZE_THRESHOLD
}

export function SampleSizeSettingsProvider({ children }: { children: ReactNode }) {
  const [threshold, setThreshold] = useState(readStoredThreshold)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(threshold))
  }, [threshold])

  return (
    <SampleSizeSettingsContext.Provider value={{ threshold, setThreshold }}>
      {children}
    </SampleSizeSettingsContext.Provider>
  )
}
