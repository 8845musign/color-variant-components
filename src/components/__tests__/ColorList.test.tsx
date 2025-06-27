/** @jsx h */
import { h } from 'preact'
import { render } from '@testing-library/preact'
import { describe, it, expect } from 'vitest'
import { ColorList } from '../ColorList'
import { ColorVariable } from '../../types'

describe('ColorList', () => {
  const mockVariables: ColorVariable[] = [
    { id: 'var1', name: 'Primary', color: { r: 1, g: 0, b: 0 }, hex: '#ff0000' },
    { id: 'var2', name: 'Secondary', color: { r: 0, g: 1, b: 0 }, hex: '#00ff00' },
    { id: 'var3', name: 'Tertiary', color: { r: 0, g: 0, b: 1 }, hex: '#0000ff' }
  ]

  it('should render all color items', () => {
    const { container } = render(<ColorList colorVariables={mockVariables} />)
    const colorItems = container.querySelectorAll('.color-item')
    
    expect(colorItems).toHaveLength(3)
  })

  it('should display empty state when no colors', () => {
    const { getByText } = render(<ColorList colorVariables={[]} />)
    expect(getByText('No color variables found in this file')).toBeTruthy()
  })

  it('should render color names correctly', () => {
    const { getByText } = render(<ColorList colorVariables={mockVariables} />)
    
    expect(getByText('Primary')).toBeTruthy()
    expect(getByText('Secondary')).toBeTruthy()
    expect(getByText('Tertiary')).toBeTruthy()
  })

  it('should render hex values correctly', () => {
    const { getByText } = render(<ColorList colorVariables={mockVariables} />)
    
    expect(getByText('#ff0000')).toBeTruthy()
    expect(getByText('#00ff00')).toBeTruthy()
    expect(getByText('#0000ff')).toBeTruthy()
  })
})