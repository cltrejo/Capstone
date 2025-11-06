import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import PrivateRoute from '../utils/PrivateRoute'

vi.mock('../utils/auth', () => ({
  isAuthenticated: vi.fn()
}))

import { isAuthenticated } from '../utils/auth'

function Protected() {
  return <div>Contenido protegido</div>
}

function Login() {
  return <div>Página de login</div>
}

describe('PrivateRoute', () => {
  it('redirige a /login cuando no autenticado', async () => {
    isAuthenticated.mockResolvedValueOnce(false)
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/protected" element={<PrivateRoute><Protected/></PrivateRoute>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Página de login')).toBeInTheDocument()
    })
  })

  it('muestra contenido cuando autenticado', async () => {
    isAuthenticated.mockResolvedValueOnce(true)
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/protected" element={<PrivateRoute><Protected/></PrivateRoute>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
    })
  })
})