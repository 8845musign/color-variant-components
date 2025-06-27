import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ComponentService } from '../component-service'
import { ColorVariable } from '../../types'

describe('ComponentService', () => {
  let service: ComponentService
  let mockRectangle: any
  let mockComponent: any
  let mockGroup: any

  beforeEach(() => {
    service = new ComponentService()
    vi.clearAllMocks()

    // Mock rectangle
    mockRectangle = {
      resize: vi.fn(),
      name: '',
      fills: [],
      x: 0,
      y: 0
    }

    // Mock component
    mockComponent = {
      name: '',
      resize: vi.fn(),
      appendChild: vi.fn(),
      x: 0,
      y: 0,
      width: 120,
      height: 120
    }

    // Mock group
    mockGroup = {
      name: '',
      x: 0,
      y: 0
    }

    vi.mocked(figma.createRectangle).mockReturnValue(mockRectangle)
    vi.mocked(figma.createComponent).mockReturnValue(mockComponent)
    vi.mocked(figma.group).mockReturnValue(mockGroup)
    vi.mocked(figma.viewport.scrollAndZoomIntoView).mockImplementation(() => {})
  })

  describe('createColorComponents', () => {
    it('should create components for color variables', async () => {
      const colorVariables: ColorVariable[] = [
        { id: 'var1', name: 'Primary', color: { r: 1, g: 0, b: 0 }, hex: '#ff0000' },
        { id: 'var2', name: 'Secondary', color: { r: 0, g: 1, b: 0 }, hex: '#00ff00' }
      ]

      const mockVariable = { id: 'var1', name: 'Primary' }
      vi.mocked(figma.variables.getVariableByIdAsync).mockResolvedValue(mockVariable as any)
      // setBoundVariableForPaint is not mocked by default, so we need to add it
      ;(figma.variables as any).setBoundVariableForPaint = vi.fn((paint) => paint)

      await service.createColorComponents(colorVariables)

      expect(figma.createRectangle).toHaveBeenCalledTimes(2)
      expect(figma.createComponent).toHaveBeenCalledTimes(2)
      expect(mockRectangle.resize).toHaveBeenCalledWith(120, 120)
      expect(mockComponent.resize).toHaveBeenCalledWith(120, 120)
      expect(figma.notify).toHaveBeenCalledWith('Created 2 color variant components')
    })

    it('should handle empty color variables', async () => {
      await service.createColorComponents([])

      expect(figma.createRectangle).not.toHaveBeenCalled()
      expect(figma.notify).toHaveBeenCalledWith('No color variables selected')
    })

    it('should layout components in a grid', async () => {
      const colorVariables: ColorVariable[] = []
      for (let i = 0; i < 7; i++) {
        colorVariables.push({
          id: `var${i}`,
          name: `Color ${i}`,
          color: { r: 0, g: 0, b: 0 },
          hex: '#000000'
        })
      }

      vi.mocked(figma.variables.getVariableByIdAsync).mockResolvedValue(null)

      await service.createColorComponents(colorVariables)

      // Check grid layout (5 columns)
      expect(mockComponent.x).toBe(140) // Last component is at position 1 in row 2
      expect(mockComponent.y).toBe(140) // Second row
    })

    it('should center components in viewport', async () => {
      const colorVariables: ColorVariable[] = [
        { id: 'var1', name: 'Color', color: { r: 0, g: 0, b: 0 }, hex: '#000000' }
      ]

      vi.mocked(figma.viewport.center).value = { x: 500, y: 300 }
      vi.mocked(figma.variables.getVariableByIdAsync).mockResolvedValue(null)

      await service.createColorComponents(colorVariables)

      expect(figma.viewport.scrollAndZoomIntoView).toHaveBeenCalledWith([mockGroup])
      expect(figma.currentPage.selection).toEqual([mockGroup])
    })

    it('should handle errors gracefully', async () => {
      const colorVariables: ColorVariable[] = [
        { id: 'var1', name: 'Error Color', color: { r: 1, g: 0, b: 0 }, hex: '#ff0000' }
      ]

      vi.mocked(figma.createRectangle).mockImplementation(() => {
        throw new Error('Failed to create rectangle')
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await service.createColorComponents(colorVariables)

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error creating component for Error Color:',
        expect.any(Error)
      )
      // No notification is sent when component creation fails
      expect(figma.notify).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should bind variables to fills when available', async () => {
      const colorVariables: ColorVariable[] = [
        { id: 'var1', name: 'Bound Color', color: { r: 0.5, g: 0.5, b: 0.5 }, hex: '#808080' }
      ]

      const mockVariable = { id: 'var1', name: 'Bound Color' }
      const mockPaint = { type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }
      
      vi.mocked(figma.variables.getVariableByIdAsync).mockResolvedValue(mockVariable as any)
      ;(figma.variables as any).setBoundVariableForPaint = vi.fn(() => mockPaint)

      mockRectangle.fills = [mockPaint]

      await service.createColorComponents(colorVariables)

      expect((figma.variables as any).setBoundVariableForPaint).toHaveBeenCalled()
      const [paint, field, variable] = (figma.variables as any).setBoundVariableForPaint.mock.calls[0]
      expect(paint.type).toBe('SOLID')
      expect(paint.color).toEqual({ r: 0.5, g: 0.5, b: 0.5 })
      expect(field).toBe('color')
      expect(variable).toEqual(mockVariable)
    })
  })
})