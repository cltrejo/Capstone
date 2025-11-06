import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Login } from '../pages/Login'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
  vi.spyOn(Storage.prototype, 'setItem')
})

describe('Login page', () => {
  it('muestra error con credenciales inválidas', async () => {
    fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ detail: 'invalid' }) })
    const { container } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    fireEvent.change(container.querySelector('input[name="username"]'), { target: { value: 'john' } })
    fireEvent.change(container.querySelector('input[name="password"]'), { target: { value: 'bad' } })
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }))

    // Espera a que aparezca el mensaje de error
    const error = await screen.findByText(/Credenciales incorrectas/i)
    expect(error).toBeInTheDocument()
  })

  it('guarda token en localStorage con credenciales válidas', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ token: 'abc', user: { username: 'john' } }) })
    const { container } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    fireEvent.change(container.querySelector('input[name="username"]'), { target: { value: 'john' } })
    fireEvent.change(container.querySelector('input[name="password"]'), { target: { value: 'good' } })
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }))

    // setItem debe ser llamada
    await vi.waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'abc')
    })
  })
})