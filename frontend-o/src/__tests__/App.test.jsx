import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import App from '../App.jsx'

vi.mock('../utils/auth', () => ({
  isAuthenticated: vi.fn().mockResolvedValue(true)
}))

vi.mock('../hooks/useSensor', () => ({
  useSensor: () => ({
    habitaciones: [],
    habitacionSeleccionada: null,
    idHabitacionSeleccionada: null,
    setIdHabitacionSeleccionada: () => {}
  })
}))

describe('App routing', () => {
  it('redirige \'/\' a \'/home\' y renderiza Home', async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    )
    // Texto específico de Home cuando no hay habitación seleccionada
    const prompt = await screen.findByText(/Selecciona una habitación para ver los detalles/)
    expect(prompt).toBeInTheDocument()
  })
})