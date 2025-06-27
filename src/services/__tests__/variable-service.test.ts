import { describe, it, expect, beforeEach, vi } from 'vitest'
import { VariableService } from '../variable-service'

describe('VariableService', () => {
  let service: VariableService

  beforeEach(() => {
    service = new VariableService()
    vi.clearAllMocks()
  })

  describe('getCollections', () => {
    it('should return collections with color counts', async () => {
      const mockCollections = [
        { id: 'col1', name: 'Colors', variableIds: ['var1', 'var2', 'var3'] },
        { id: 'col2', name: 'Empty', variableIds: [] }
      ]
      
      const mockVariables = [
        { id: 'var1', name: 'Primary', resolvedType: 'COLOR', valuesByMode: { mode1: { r: 1, g: 0, b: 0 } } },
        { id: 'var2', name: 'Secondary', resolvedType: 'COLOR', valuesByMode: { mode1: { r: 0, g: 1, b: 0 } } },
        { id: 'var3', name: 'Text', resolvedType: 'FLOAT', valuesByMode: { mode1: 16 } }
      ]

      vi.mocked(figma.variables.getLocalVariableCollectionsAsync).mockResolvedValue(mockCollections as any)
      vi.mocked(figma.variables.getVariableByIdAsync).mockImplementation(async (id) => {
        return mockVariables.find(v => v.id === id) as any
      })

      const result = await service.getCollections()

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: 'col1',
        name: 'Colors',
        colorCount: 2
      })
    })

    it('should handle empty collections', async () => {
      vi.mocked(figma.variables.getLocalVariableCollectionsAsync).mockResolvedValue([])
      
      const result = await service.getCollections()
      
      expect(result).toEqual([])
    })
  })

  describe('getColorVariables', () => {
    it('should return color variables from selected collections', async () => {
      const mockCollections = [
        { id: 'col1', name: 'Brand', variableIds: ['var1', 'var2'] },
        { id: 'col2', name: 'UI', variableIds: ['var3'] }
      ]
      
      const mockVariables = [
        { 
          id: 'var1', 
          name: 'brand/primary', 
          resolvedType: 'COLOR', 
          valuesByMode: { mode1: { r: 0.2, g: 0.4, b: 0.6 } } 
        },
        { 
          id: 'var2', 
          name: 'brand/secondary', 
          resolvedType: 'COLOR', 
          valuesByMode: { mode1: { r: 0.8, g: 0.1, b: 0.3 } } 
        },
        { 
          id: 'var3', 
          name: 'ui/background', 
          resolvedType: 'COLOR', 
          valuesByMode: { mode1: { r: 1, g: 1, b: 1 } } 
        }
      ]

      vi.mocked(figma.variables.getLocalVariableCollectionsAsync).mockResolvedValue(mockCollections as any)
      vi.mocked(figma.variables.getVariableByIdAsync).mockImplementation(async (id) => {
        return mockVariables.find(v => v.id === id) as any
      })

      const result = await service.getColorVariables(['col1'])

      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({
        id: 'var1',
        name: 'brand/primary',
        hex: '#336699'
      })
      expect(result[1]).toMatchObject({
        id: 'var2',
        name: 'brand/secondary',
        hex: '#cc1a4d'
      })
    })

    it('should resolve color aliases', async () => {
      const mockCollections = [
        { id: 'col1', name: 'Colors', variableIds: ['var1', 'var2'] }
      ]
      
      const mockVariables = {
        var1: { 
          id: 'var1', 
          name: 'base/red', 
          resolvedType: 'COLOR', 
          valuesByMode: { mode1: { r: 1, g: 0, b: 0 } } 
        },
        var2: { 
          id: 'var2', 
          name: 'semantic/error', 
          resolvedType: 'COLOR', 
          valuesByMode: { mode1: { type: 'VARIABLE_ALIAS', id: 'var1' } } 
        }
      }

      vi.mocked(figma.variables.getLocalVariableCollectionsAsync).mockResolvedValue(mockCollections as any)
      vi.mocked(figma.variables.getVariableByIdAsync).mockImplementation(async (id) => {
        return mockVariables[id as keyof typeof mockVariables] as any
      })

      const result = await service.getColorVariables(['col1'])

      expect(result).toHaveLength(2)
      expect(result[1]).toMatchObject({
        id: 'var2',
        name: 'semantic/error',
        color: { r: 1, g: 0, b: 0 },
        hex: '#ff0000'
      })
    })

    it('should handle max recursion depth for aliases', async () => {
      const mockCollections = [
        { id: 'col1', name: 'Colors', variableIds: ['var1'] }
      ]
      
      // Create circular alias reference
      vi.mocked(figma.variables.getLocalVariableCollectionsAsync).mockResolvedValue(mockCollections as any)
      vi.mocked(figma.variables.getVariableByIdAsync).mockResolvedValue({
        id: 'var1',
        name: 'circular',
        resolvedType: 'COLOR',
        valuesByMode: { mode1: { type: 'VARIABLE_ALIAS', id: 'var1' } }
      } as any)

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const result = await service.getColorVariables(['col1'])

      expect(result).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Max recursion depth reached while resolving color alias')
      
      consoleSpy.mockRestore()
    })
  })
})