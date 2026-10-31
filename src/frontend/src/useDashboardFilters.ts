import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { filterMeetings, hasActiveFilters, type DashboardFilterState, type Stakeholder } from './dashboardFilters'
import type { Meeting } from './types'

export function useDashboardFilters() {
  const [params] = useSearchParams()
  const search = params.toString()
  const filters = useMemo<DashboardFilterState>(() => {
    const current = new URLSearchParams(search)
    const callTypeValue = current.get('callType')
    const stakeholderValue = current.get('stakeholder') ?? 'all'
    return {
      callType: callTypeValue && ['support', 'external', 'internal'].includes(callTypeValue)
        ? callTypeValue as DashboardFilterState['callType']
        : '',
      module: current.get('module') ?? '',
      from: current.get('from') ?? '',
      to: current.get('to') ?? '',
      account: current.get('account') ?? '',
      stakeholder: (['all', 'support', 'sales', 'product', 'engineering'].includes(stakeholderValue)
        ? stakeholderValue
        : 'all') as Stakeholder,
    }
  }, [search])
  return {
    filters,
    isFiltered: hasActiveFilters(filters),
    apply: useCallback((meetings: Meeting[]) => filterMeetings(meetings, filters), [filters]),
  }
}
