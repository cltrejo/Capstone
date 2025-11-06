import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Header } from '../components/Header'

vi.mock('react-router-dom', async (importOriginal) => {
  const mod = await importOriginal()
  return {
    ...mod,
    useNavigate: () => vi.fn()
  }
})

describe('Header', () => {
  it('muestra saludo y permite cerrar sesión', () => {
    localStorage.setItem('username', 'claudia')
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <Header />
      </MemoryRouter>
    )
    expect(screen.getByText(/Bienvenido CLAUDIA!/)).toBeInTheDocument()
    const btn = screen.getByRole('button', { name: /Cerrar Sesión/i })
    fireEvent.click(btn)
    expect(localStorage.getItem('token')).toBeNull()
  })
})