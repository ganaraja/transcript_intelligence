import type { CallType, Meeting } from './types'

export type Stakeholder = 'all' | 'support' | 'sales' | 'product' | 'engineering'

export type DashboardFilterState = {
  callType: CallType | ''
  module: string
  from: string
  to: string
  account: string
  stakeholder: Stakeholder
}

export const STAKEHOLDER_CALL_TYPES: Record<Stakeholder, CallType[]> = {
  all: ['support', 'external', 'internal'],
  support: ['support'],
  sales: ['external'],
  product: ['support', 'external', 'internal'],
  engineering: ['internal', 'support'],
}

export function filterMeetings(meetings: Meeting[], filters: DashboardFilterState): Meeting[] {
  const allowedTypes = STAKEHOLDER_CALL_TYPES[filters.stakeholder]
  return meetings.filter((meeting) => {
    if (!allowedTypes.includes(meeting.call_type)) return false
    if (filters.callType && meeting.call_type !== filters.callType) return false
    if (filters.module && !meeting.product_modules.includes(filters.module)) return false
    if (filters.account && meeting.customer_name !== filters.account) return false
    const date = meeting.start_time?.slice(0, 10)
    if (filters.from && (!date || date < filters.from)) return false
    if (filters.to && (!date || date > filters.to)) return false
    return true
  })
}

export function hasActiveFilters(filters: DashboardFilterState): boolean {
  return (
    filters.callType !== '' ||
    filters.module !== '' ||
    filters.from !== '' ||
    filters.to !== '' ||
    filters.account !== '' ||
    filters.stakeholder !== 'all'
  )
}
