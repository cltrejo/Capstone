import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NotFound } from '../pages/NotFound'

describe('NotFound', () => {
  it('renderiza sin errores', () => {
    const { container } = render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    )
    expect(container.querySelector('.notfound')).toBeTruthy()
  })
})