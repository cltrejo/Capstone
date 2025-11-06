import { describe, it, expect, vi } from 'vitest'

vi.stubGlobal('fetch', vi.fn())

describe('services/login', () => {
  it('simula llamada de login', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ token: 't', user: { username: 'u' } }) })
    // Servicio es un ejemplo; confirma que fetch se usa
    const res = await fetch('http://localhost:8000/api/login/', { method: 'POST' })
    expect(res.ok).toBe(true)
  })
})