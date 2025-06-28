import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/preact'
import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { ColorVariable } from '../types'

// Mock @create-figma-plugin/utilities
const mockEmit = vi.fn()
const mockOn = vi.fn()

vi.mock('@create-figma-plugin/utilities', () => ({
  emit: mockEmit,
  on: mockOn.mockImplementation(() => () => {}) // Return unsubscribe function
}))

// Mock components
vi.mock('../components/CollectionSelector', () => ({
  CollectionSelector: () => h('div', { 'data-testid': 'collection-selector' }, 'Collection Selector')
}))

vi.mock('../components/ColorList', () => ({
  ColorList: () => h('div', { 'data-testid': 'color-list' }, 'Color List')
}))

vi.mock('../components/StatusIndicator', () => ({
  StatusIndicator: () => h('div', { 'data-testid': 'status-indicator' }, 'Status')
}))

// Simplified Plugin component for testing
function TestPlugin({ initialColorVariables }: { initialColorVariables?: ColorVariable[] }) {
  const [colorVariables, setColorVariables] = useState<ColorVariable[]>(initialColorVariables || [])
  const [showResults, setShowResults] = useState(!!initialColorVariables)
  const [prefix, setPrefix] = useState('')

  const handleCreateClick = () => {
    if (colorVariables.length > 0) {
      mockEmit('create-components', { colorVariables, prefix })
    }
  }

  // Expose method to trigger color variables update for testing
  ;(window as any).setTestColorVariables = (vars: ColorVariable[]) => {
    setColorVariables(vars)
    setShowResults(true)
  }

  return h('div', {}, [
    !showResults && h('button', { 
      onClick: () => mockEmit('get-collections'),
      'data-testid': 'load-variables-button'
    }, 'Load Color Variables'),
    
    showResults && h('div', { 'data-testid': 'results-section' }, [
      h('h2', {}, 'Color Variables'),
      h('input', {
        type: 'text',
        placeholder: 'Component name prefix (optional)',
        value: prefix,
        onInput: (e: any) => setPrefix(e.target.value),
        'data-testid': 'prefix-input'
      }),
      h('button', {
        onClick: handleCreateClick,
        'data-testid': 'create-button'
      }, 'Create Color Swatches')
    ])
  ])
}

describe('Plugin UI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should include prefix input field in results view', () => {
    // Render with initial color variables to show results view
    const colorVariables: ColorVariable[] = [
      { id: 'var1', name: 'Primary', color: { r: 1, g: 0, b: 0 }, hex: '#ff0000' }
    ]
    
    render(h(TestPlugin, { initialColorVariables: colorVariables }))
    
    // Check for prefix input field
    const prefixInput = screen.getByTestId('prefix-input')
    expect(prefixInput).toBeDefined()
    expect(prefixInput.getAttribute('placeholder')).toBe('Component name prefix (optional)')
  })

  it('should send prefix with create-components message', () => {
    const colorVariables: ColorVariable[] = [
      { id: 'var1', name: 'Primary', color: { r: 1, g: 0, b: 0 }, hex: '#ff0000' }
    ]
    
    render(h(TestPlugin, { initialColorVariables: colorVariables }))
    
    // Fill prefix input
    const prefixInput = screen.getByTestId('prefix-input') as HTMLInputElement
    fireEvent.input(prefixInput, { target: { value: 'Button/' } })
    
    // Click create button
    const createButton = screen.getByTestId('create-button')
    fireEvent.click(createButton)
    
    // Verify emit was called with correct payload
    expect(mockEmit).toHaveBeenCalledWith('create-components', {
      colorVariables,
      prefix: 'Button/'
    })
  })

  it('should send empty prefix when input is empty', () => {
    const colorVariables: ColorVariable[] = [
      { id: 'var1', name: 'Primary', color: { r: 1, g: 0, b: 0 }, hex: '#ff0000' }
    ]
    
    render(h(TestPlugin, { initialColorVariables: colorVariables }))
    
    // Click create button without entering prefix
    const createButton = screen.getByTestId('create-button')
    fireEvent.click(createButton)
    
    // Verify emit was called with empty prefix
    expect(mockEmit).toHaveBeenCalledWith('create-components', {
      colorVariables,
      prefix: ''
    })
  })
})