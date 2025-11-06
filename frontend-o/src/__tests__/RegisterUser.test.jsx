import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RegisterUser } from '../pages/RegisterUser'

vi.stubGlobal('fetch', vi.fn())

describe('RegisterUser', () => {
  it('muestra error si faltan campos', () => {
    render(
      <MemoryRouter>
        <RegisterUser />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }))
    expect(screen.getByText(/Completa todos los campos/i)).toBeInTheDocument()
  })
})