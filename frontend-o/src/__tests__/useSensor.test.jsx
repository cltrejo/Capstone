import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useSensor } from '../hooks/useSensor'
import { useEffect } from 'react'

vi.stubGlobal('fetch', vi.fn())

function TestComp() {
  const { obtenerHabitaciones, habitaciones } = useSensor()
  useEffect(() => {
    obtenerHabitaciones()
  }, [])
  return <div>count:{habitaciones.length}</div>
}

describe('useSensor hook', () => {
  it('obtiene habitaciones y actualiza estado', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ([{ id_habitacion: 1, nombre: 'Sala A' }]) })
    render(<TestComp />)
    const el = await screen.findByText(/count:1/)
    expect(el).toBeInTheDocument()
  })
})