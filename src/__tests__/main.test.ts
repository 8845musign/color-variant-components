import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { ColorVariable } from '../types'

// Mock handlers storage
let handlers: Record<string, Function> = {}

// Mock @create-figma-plugin/utilities
vi.mock('@create-figma-plugin/utilities', () => ({
  on: vi.fn((event: string, handler: Function) => {
    handlers[event] = handler
  }),
  emit: vi.fn(),
  showUI: vi.fn()
}))

// Mock services
const mockGetCollections = vi.fn()
const mockGetColorVariables = vi.fn()
const mockCreateColorComponents = vi.fn()

vi.mock('../services/variable-service', () => ({
  VariableService: vi.fn(() => ({
    getCollections: mockGetCollections,
    getColorVariables: mockGetColorVariables
  }))
}))

vi.mock('../services/component-service', () => ({
  ComponentService: vi.fn(() => ({
    createColorComponents: mockCreateColorComponents
  }))
}))

describe('main', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    handlers = {}
    // Dynamically import main to trigger registration
    const mainModule = await import('../main')
    mainModule.default()
  })

  afterEach(() => {
    vi.resetModules()
  })

  it('should register create-components handler that accepts prefix', async () => {
    // Verify handler was registered
    expect(handlers['create-components']).toBeDefined()

    // Test with color variables and prefix
    const colorVariables: ColorVariable[] = [
      { id: 'var1', name: 'Primary', color: { r: 1, g: 0, b: 0 }, hex: '#ff0000' }
    ]
    const payload = { colorVariables, prefix: 'Button/' }

    // Call the handler
    await handlers['create-components'](payload)

    // Verify service was called with both parameters
    expect(mockCreateColorComponents).toHaveBeenCalledWith(colorVariables, 'Button/')
  })

  it('should handle create-components without prefix for backward compatibility', async () => {
    const colorVariables: ColorVariable[] = [
      { id: 'var1', name: 'Primary', color: { r: 1, g: 0, b: 0 }, hex: '#ff0000' }
    ]

    // Call handler with just color variables (old format)
    await handlers['create-components'](colorVariables)

    // Should call service without prefix (no second parameter)
    expect(mockCreateColorComponents).toHaveBeenCalledWith(colorVariables)
  })
})