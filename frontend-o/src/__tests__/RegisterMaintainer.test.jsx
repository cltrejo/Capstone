import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RegisterMaintainer from '../pages/RegisterMaintainer'

describe('RegisterMaintainer', () => {
  it('muestra error si contraseñas no coinciden', () => {
    const { container } = render(
      <MemoryRouter>
        <RegisterMaintainer />
      </MemoryRouter>
    )
    fireEvent.change(container.querySelector('input[name="nombre"]'), { target: { value: 'Ana' } })
    fireEvent.change(container.querySelector('input[name="apellidoPaterno"]'), { target: { value: 'P' } })
    fireEvent.change(container.querySelector('input[name="apellidoMaterno"]'), { target: { value: 'M' } })
    fireEvent.change(container.querySelector('input[name="email"]'), { target: { value: 'a@b.com' } })
    fireEvent.change(container.querySelector('input[name="password"]'), { target: { value: '123' } })
    fireEvent.change(container.querySelector('input[name="confirmPassword"]'), { target: { value: '456' } })
    fireEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }))
    expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeInTheDocument()
  })
})