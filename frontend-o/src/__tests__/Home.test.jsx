import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Home } from '../pages/Home'

vi.stubGlobal('fetch', vi.fn())

vi.mock('../hooks/useSensor', () => ({
  useSensor: () => ({
    habitaciones: [{ id_habitacion: 1, nombre: 'Sala Norte', temperatura_actual: 28, forma_svg: '<svg/>' }],
    habitacionSeleccionada: { id_habitacion: 1, nombre: 'Sala Norte', temperatura_actual: 28, forma_svg: '<svg/>' },
    idHabitacionSeleccionada: 1,
    setIdHabitacionSeleccionada: () => {}
  })
}))

describe('Home', () => {
  it('muestra alerta de temperatura alta y botón de detalle', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    expect(screen.getByText(/Temperatura alta detectada/)).toBeInTheDocument()
    const btn = screen.getByRole('button', { name: /Ver detalle del sensor/i })
    expect(btn).toBeInTheDocument()
  })

  it('click en detalle intenta obtener sensores', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ([{ id_thermostato: 5 }]) })
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    const btn = screen.getByRole('button', { name: /Ver detalle del sensor/i })
    fireEvent.click(btn)
    await vi.waitFor(() => {
      expect(fetch).toHaveBeenCalled()
    })
  })
})