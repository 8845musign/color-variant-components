import { ColorVariable, RGB, Variable, VariableAlias, VariableCollection } from '../types'
import { rgbToHex } from '../utils/color-utils'

export class VariableService {
  async getCollections(): Promise<VariableCollection[]> {
    const collections = await figma.variables.getLocalVariableCollectionsAsync()
    
    const collectionData = await Promise.all(
      collections.map(async (collection) => {
        const colorVariables = await this.getColorVariablesInCollection(collection.variableIds)
        return {
          id: collection.id,
          name: collection.name,
          colorCount: colorVariables.length
        }
      })
    )
    
    return collectionData.filter(c => c.colorCount > 0)
  }

  async getColorVariables(collectionIds: string[]): Promise<ColorVariable[]> {
    const collections = await figma.variables.getLocalVariableCollectionsAsync()
    const selectedCollections = collections.filter(c => collectionIds.includes(c.id))
    
    const allVariables: ColorVariable[] = []
    
    for (const collection of selectedCollections) {
      const colorVariables = await this.getColorVariablesInCollection(collection.variableIds)
      allVariables.push(...colorVariables)
    }
    
    return allVariables
  }

  private async getColorVariablesInCollection(variableIds: string[]): Promise<ColorVariable[]> {
    const colorVariables: ColorVariable[] = []
    
    for (const variableId of variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(variableId)
      if (variable && variable.resolvedType === 'COLOR') {
        const firstModeId = Object.keys(variable.valuesByMode)[0]
        const colorValue = await this.resolveColorValue(variable.valuesByMode[firstModeId])
        
        if (colorValue) {
          colorVariables.push({
            id: variable.id,
            name: variable.name,
            color: colorValue,
            hex: rgbToHex(colorValue)
          })
        }
      }
    }
    
    return colorVariables
  }

  private async resolveColorValue(value: any, depth = 0): Promise<RGB | null> {
    if (depth > 10) {
      console.warn('Max recursion depth reached while resolving color alias')
      return null
    }

    if (value && typeof value === 'object') {
      if ('r' in value && 'g' in value && 'b' in value) {
        return { r: value.r, g: value.g, b: value.b }
      }
      
      if (value.type === 'VARIABLE_ALIAS' && value.id) {
        const aliasedVariable = await figma.variables.getVariableByIdAsync(value.id)
        if (aliasedVariable && aliasedVariable.resolvedType === 'COLOR') {
          const firstModeId = Object.keys(aliasedVariable.valuesByMode)[0]
          return this.resolveColorValue(aliasedVariable.valuesByMode[firstModeId], depth + 1)
        }
      }
    }
    
    return null
  }
}