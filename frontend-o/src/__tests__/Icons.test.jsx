import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NotFoundIcon } from '../components/Icons'

describe('Icons', () => {
  it('renderiza NotFoundIcon (svg presente)', () => {
    const { container } = render(<NotFoundIcon />)
    expect(container.querySelector('svg')).toBeTruthy()
  })
})