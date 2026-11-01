import { createContext } from 'react'
import { DEFAULT_SAMPLE_SIZE_THRESHOLD } from './sampleSizeConfig'

export type SampleSizeSettingsValue = {
  threshold: number
  setThreshold: (threshold: number) => void
}

const defaultSettings: SampleSizeSettingsValue = {
  threshold: DEFAULT_SAMPLE_SIZE_THRESHOLD,
  setThreshold: () => undefined,
}

export const SampleSizeSettingsContext = createContext(defaultSettings)
