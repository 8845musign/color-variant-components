/** @jsx h */
import { h } from 'preact'
import { render } from '@testing-library/preact'
import { describe, it, expect } from 'vitest'
import { ColorItem } from '../ColorItem'
import { ColorVariable } from '../../types'

describe('ColorItem', () => {
  const mockVariable: ColorVariable = {
    id: 'test-id',
    name: 'Brand/Primary',
    color: { r: 0.2, g: 0.4, b: 0.8 },
    hex: '#3366cc'
  }

  it('should render color swatch with correct background', () => {
    const { container } = render(<ColorItem variable={mockVariable} />)
    const swatch = container.querySelector('.color-swatch')
    
    expect(swatch).toBeTruthy()
    expect(swatch).toHaveStyle({ backgroundColor: '#3366cc' })
  })

  it('should display color name', () => {
    const { getByText } = render(<ColorItem variable={mockVariable} />)
    expect(getByText('Brand/Primary')).toBeTruthy()
  })

  it('should display hex value', () => {
    const { getByText } = render(<ColorItem variable={mockVariable} />)
    expect(getByText('#3366cc')).toBeTruthy()
  })

  it('should have correct accessibility label', () => {
    const { container } = render(<ColorItem variable={mockVariable} />)
    const swatch = container.querySelector('.color-swatch')
    
    expect(swatch).toHaveAttribute('aria-label', 'Color swatch for Brand/Primary')
  })
})