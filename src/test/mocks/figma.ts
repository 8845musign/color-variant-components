// Mock Figma plugin typings for tests
export interface RGB {
  r: number
  g: number
  b: number
}

export interface RGBA extends RGB {
  a: number
}

export interface VariableAlias {
  type: 'VARIABLE_ALIAS'
  id: string
}

export interface Variable {
  id: string
  name: string
  resolvedType: string
  valuesByMode: Record<string, any>
}

export interface VariableCollection {
  id: string
  name: string
  modes: Array<{ modeId: string; name: string }>
  variableIds: string[]
}