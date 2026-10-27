import { afterEach, describe, expect, it, vi } from 'vitest'
import { api } from '../src/api'

describe('api client', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests the expected meeting endpoint and returns its payload', async () => {
    const meeting = { meeting_id: 'meeting-123' }
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => meeting,
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(api.meeting('meeting-123')).resolves.toEqual(meeting)
    expect(fetchMock).toHaveBeenCalledWith('/api/meetings/meeting-123')
  })

  it('surfaces HTTP failures with the endpoint and status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
      }),
    )

    await expect(api.overview()).rejects.toThrow('/api/overview failed (503)')
  })
})
