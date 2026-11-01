import { useContext } from 'react'
import { SampleSizeSettingsContext } from './sampleSizeSettingsContext'

export function useSampleSizeSettings() {
  return useContext(SampleSizeSettingsContext)
}
