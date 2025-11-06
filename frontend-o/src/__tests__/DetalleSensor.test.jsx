import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { DetalleSensor } from '../pages/DetalleSensor'

describe('DetalleSensor', () => {
  it('renderiza encabezado con ID y carga datos', async () => {
    vi.stubGlobal('fetch', vi.fn())
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ([{ valor: '24.5', unidad: '°C', timestamp: new Date().toISOString() }]) })

    render(
      <MemoryRouter initialEntries={["/sensor/5"]}>
        <Routes>
          <Route path="/sensor/:id" element={<DetalleSensor />} />
        </Routes>
      </MemoryRouter>
    )

    const title = await screen.findByText(/Histórico del Thermostato 5/i)
    expect(title).toBeInTheDocument()
  })
})